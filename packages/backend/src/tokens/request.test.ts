import type QUnit from 'qunit';
import sinon from 'sinon';

import runtime from '../runtime';
import { jsonOk } from '../util/mockFetch';
import { type AuthReason, type RequestState, AuthErrorReason, AuthStatus } from './authStatus';
import { TokenVerificationErrorReason } from './errors';
import { mockInvalidSignatureJwt, mockJwks, mockJwt, mockJwtPayload, mockMalformedJwt } from './fixtures';
import type { AuthenticateRequestOptions } from './request';
import { authenticateRequest } from './request';

function assertSignedOut(assert, requestState: RequestState, reason: AuthReason, message = '') {
  assert.propEqual(requestState, {
    frontendApi: 'cafe.babe.clerk.ts',
    publishableKey: '',
    proxyUrl: '',
    status: AuthStatus.SignedOut,
    isSignedIn: false,
    isInterstitial: false,
    isUnknown: false,
    isSatellite: false,
    domain: '',
    message,
    reason,
    toAuth: {},
  });
}

function assertSignedOutToAuth(assert, requestState: RequestState) {
  assert.propContains(requestState.toAuth(), {
    sessionClaims: null,
    sessionId: null,
    session: null,
    userId: null,
    user: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    organization: null,
    getToken: {},
  });
}

function assertInterstitial(
  assert,
  requestState: RequestState,
  expectedState: {
    reason: AuthReason;
    isSatellite?: boolean;
  },
) {
  assert.propContains(requestState, {
    frontendApi: 'cafe.babe.clerk.ts',
    publishableKey: '',
    proxyUrl: '',
    status: AuthStatus.Interstitial,
    isSignedIn: false,
    isInterstitial: true,
    isUnknown: false,
    isSatellite: false,
    domain: '',
    toAuth: {},
    ...expectedState,
  });
}

function assertUnknown(assert, requestState: RequestState, reason: AuthReason) {
  assert.propContains(requestState, {
    frontendApi: 'cafe.babe.clerk.ts',
    publishableKey: '',
    status: AuthStatus.Unknown,
    isSignedIn: false,
    isInterstitial: false,
    isUnknown: true,
    isSatellite: false,
    domain: '',
    reason,
    toAuth: {},
  });
}

function assertSignedInToAuth(assert, requestState: RequestState) {
  assert.propContains(requestState.toAuth(), {
    sessionClaims: mockJwtPayload,
    sessionId: mockJwtPayload.sid,
    session: undefined,
    userId: mockJwtPayload.sub,
    user: undefined,
    orgId: undefined,
    orgRole: undefined,
    orgSlug: undefined,
    organization: undefined,
    getToken: {},
  });
}

function assertSignedIn(assert, requestState: RequestState) {
  assert.propContains(requestState, {
    frontendApi: 'cafe.babe.clerk.ts',
    publishableKey: '',
    proxyUrl: '',
    status: AuthStatus.SignedIn,
    isSignedIn: true,
    isInterstitial: false,
    isUnknown: false,
    isSatellite: false,
    domain: '',
  });
}

export default (QUnit: QUnit) => {
  const { module, test, skip } = QUnit;

  /* An otherwise bare state on a request. */
  const defaultMockAuthenticateRequestOptions = {
    apiKey: 'deadbeef',
    secretKey: '',
    apiUrl: 'https://api.clerk.test',
    apiVersion: 'v1',
    frontendApi: 'cafe.babe.clerk.ts',
    publishableKey: '',
    proxyUrl: '',
    host: 'example.com',
    userAgent: 'Mozilla/TestAgent',
    skipJwksCache: true,
    isSatellite: false,
    domain: '',
    searchParams: new URLSearchParams(),
  } satisfies AuthenticateRequestOptions;

  module('tokens.authenticateRequest(options)', hooks => {
    let fakeClock;
    let fakeFetch;

    hooks.beforeEach(() => {
      fakeClock = sinon.useFakeTimers(new Date(mockJwtPayload.iat * 1000).getTime());
      fakeFetch = sinon.stub(runtime, 'fetch');
      fakeFetch.onCall(0).returns(jsonOk(mockJwks));
    });

    hooks.afterEach(() => {
      fakeClock.restore();
      fakeFetch.restore();
      sinon.restore();
    });

    //
    // HTTP Authorization exists
    //

    test('returns signed out state if jwk fails to load from remote', async assert => {
      fakeFetch.onCall(0).returns(jsonOk({}));
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        headerToken: mockJwt,
        skipJwksCache: false,
      });

      const errMessage =
        'The JWKS endpoint did not contain any signing keys. Contact support@clerk.dev. Contact support@clerk.dev (reason=jwk-remote-failed-to-load, token-carrier=header)';
      assertSignedOut(assert, requestState, TokenVerificationErrorReason.RemoteJWKFailedToLoad, errMessage);
      assertSignedOutToAuth(assert, requestState);
    });

    test('headerToken: returns signed in state when a valid token [1y.2y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        headerToken: mockJwt,
      });

      assertSignedIn(assert, requestState);
      assertSignedInToAuth(assert, requestState);
    });

    // todo(
    //   'headerToken: returns full signed in state when a valid token with organizations enabled and resources loaded [1y.2y]',
    //   assert => {
    //     assert.true(true);
    //   },
    // );

    test('headerToken: returns signed out state when a token with invalid authorizedParties [1y.2n]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        headerToken: mockJwt,
        authorizedParties: ['whatever'],
      });

      const errMessage =
        'Invalid JWT Authorized party claim (azp) "https://accounts.inspired.puma-74.lcl.dev". Expected "whatever". (reason=token-invalid-authorized-parties, token-carrier=header)';
      assertSignedOut(assert, requestState, TokenVerificationErrorReason.TokenInvalidAuthorizedParties, errMessage);
      assertSignedOutToAuth(assert, requestState);
    });

    test('headerToken: returns interstitial state when token expired [1y.2n]', async assert => {
      // advance clock for 1 hour
      fakeClock.tick(3600 * 1000);

      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        headerToken: mockJwt,
      });

      assertUnknown(assert, requestState, TokenVerificationErrorReason.TokenExpired);
      assert.strictEqual(requestState.toAuth(), null);
    });

    test('headerToken: returns signed out state when invalid signature [1y.2n]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        headerToken: mockInvalidSignatureJwt,
      });

      const errMessage = 'JWT signature is invalid. (reason=token-invalid-signature, token-carrier=header)';
      assertSignedOut(assert, requestState, TokenVerificationErrorReason.TokenInvalidSignature, errMessage);
      assertSignedOutToAuth(assert, requestState);
    });

    test('headerToken: returns signed out state when an malformed token [1y.1n]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        headerToken: 'test_header_token',
      });

      const errMessage =
        'Invalid JWT form. A JWT consists of three parts separated by dots. (reason=token-invalid, token-carrier=header)';
      assertSignedOut(assert, requestState, TokenVerificationErrorReason.TokenInvalid, errMessage);
      assertSignedOutToAuth(assert, requestState);
    });

    //
    // HTTP Authorization does NOT exist and __session cookie exists
    //

    test('cookieToken: returns signed out state when cross-origin request [2y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        origin: 'https://clerk.dev',
        forwardedProto: '80',
        cookieToken: mockJwt,
      });

      assertSignedOut(assert, requestState, AuthErrorReason.HeaderMissingCORS);
      assertSignedOutToAuth(assert, requestState);
    });

    test('cookieToken: returns signed out when non browser requests in development [3y]', async assert => {
      const nonBrowserUserAgent = 'curl';
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        apiKey: 'test_deadbeef',
        userAgent: nonBrowserUserAgent,
        clientUat: '12345',
        cookieToken: mockJwt,
      });

      assertSignedOut(assert, requestState, AuthErrorReason.HeaderMissingNonBrowser);
      assertSignedOutToAuth(assert, requestState);
    });

    test('cookieToken: returns interstitial when clientUat is missing or equals to 0 and is satellite and not is synced [11y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        apiKey: 'deadbeef',
        clientUat: '0',
        isSatellite: true,
      });

      assertInterstitial(assert, requestState, {
        reason: AuthErrorReason.SatelliteCookieNeedsSyncing,
        isSatellite: true,
      });
      assert.equal(requestState.message, '');
      assert.strictEqual(requestState.toAuth(), null);
    });

    test('cookieToken: returns signed out when no cookieToken and no clientUat in production [4y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        apiKey: 'live_deadbeef',
      });

      assertSignedOut(assert, requestState, AuthErrorReason.CookieAndUATMissing);
      assertSignedOutToAuth(assert, requestState);
    });

    test('cookieToken: returns interstitial when no clientUat in development [5y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        cookieToken: mockJwt,
        apiKey: 'test_deadbeef',
      });

      assertInterstitial(assert, requestState, { reason: AuthErrorReason.CookieUATMissing });
      assert.equal(requestState.message, '');
      assert.strictEqual(requestState.toAuth(), null);
    });

    // Omit because it caused view-source to always returns the interstitial in development mode (there's no referrer for view-source)
    skip('cookieToken: returns interstitial when no referrer in development [6y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        cookieToken: mockJwt,
        apiKey: 'test_deadbeef',
        clientUat: '12345',
      });

      assertInterstitial(assert, requestState, { reason: AuthErrorReason.CrossOriginReferrer });
      assert.equal(requestState.message, '');
      assert.strictEqual(requestState.toAuth(), null);
    });

    test('cookieToken: returns interstitial when crossOriginReferrer in development [6y]', async assert => {
      // Scenario: after auth action on Clerk-hosted UIs
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        cookieToken: mockJwt,
        apiKey: 'test_deadbeef',
        clientUat: '12345',
        referrer: 'https://clerk.dev',
      });

      assertInterstitial(assert, requestState, { reason: AuthErrorReason.CrossOriginReferrer });
      assert.equal(requestState.message, '');
      assert.strictEqual(requestState.toAuth(), null);
    });

    // // Note: The user is definitely signed out here so this interstitial can be
    // // eliminated. We can keep it if we're worried about something inspecting
    // // the __session cookie manually
    skip('cookieToken: returns interstitial when clientUat = 0 [7y]', assert => {
      assert.true(true);
    });

    test('cookieToken: returns interstitial when clientUat > 0 and no cookieToken [8y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        apiKey: 'deadbeef',
        clientUat: '1234',
      });

      assertInterstitial(assert, requestState, { reason: AuthErrorReason.CookieMissing });
      assert.equal(requestState.message, '');
      assert.strictEqual(requestState.toAuth(), null);
    });

    test('cookieToken: returns signed out when clientUat = 0 and no cookieToken [9y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        clientUat: '0',
      });

      assertSignedOut(assert, requestState, AuthErrorReason.StandardSignedOut);
      assertSignedOutToAuth(assert, requestState);
    });

    test('cookieToken: returns interstitial when clientUat > cookieToken.iat [10n]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        cookieToken: mockJwt,
        clientUat: `${mockJwtPayload.iat + 10}`,
      });

      assertInterstitial(assert, requestState, { reason: AuthErrorReason.CookieOutDated });
      assert.equal(requestState.message, '');
      assert.strictEqual(requestState.toAuth(), null);
    });

    test('cookieToken: returns signed out when cookieToken.iat >= clientUat and malformed token [10y.1n]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        cookieToken: mockMalformedJwt,
        clientUat: `${mockJwtPayload.iat - 10}`,
      });

      const errMessage =
        'Subject claim (sub) is required and must be a string. Received undefined. Make sure that this is a valid Clerk generate JWT. (reason=token-verification-failed, token-carrier=cookie)';
      assertSignedOut(assert, requestState, TokenVerificationErrorReason.TokenVerificationFailed, errMessage);
      assertSignedOutToAuth(assert, requestState);
    });

    test('cookieToken: returns signed in when cookieToken.iat >= clientUat and valid token [10y.2y]', async assert => {
      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        cookieToken: mockJwt,
        clientUat: `${mockJwtPayload.iat - 10}`,
      });

      assertSignedIn(assert, requestState);
      assertSignedInToAuth(assert, requestState);
    });

    // todo(
    //   'cookieToken: returns signed in when cookieToken.iat >= clientUat and expired token and ssrToken [10y.2n.1y]',
    //   assert => {
    //     assert.true(true);
    //   },
    // );

    test('cookieToken: returns interstitial when cookieToken.iat >= clientUat and expired token [10y.2n.1n]', async assert => {
      // advance clock for 1 hour
      fakeClock.tick(3600 * 1000);

      const requestState = await authenticateRequest({
        ...defaultMockAuthenticateRequestOptions,
        cookieToken: mockJwt,
        clientUat: `${mockJwtPayload.iat - 10}`,
      });

      assertInterstitial(assert, requestState, { reason: TokenVerificationErrorReason.TokenExpired });
      assert.true(/^JWT is expired/.test(requestState.message || ''));
      assert.strictEqual(requestState.toAuth(), null);
    });
  });
};
