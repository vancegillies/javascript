import { AuthStatus, createGetToken, createSignedOutState, Session, User } from '@clerk/backend-core';
import Clerk, { sessions, users } from '@clerk/clerk-sdk-node';
import { ServerGetToken } from '@clerk/types';
import cookie from 'cookie';

// should be shared between remix + gatsby
export const parseCookies = (headers: any) => {
  return cookie.parse(headers.get('cookie') || '');
};

export type AuthData = {
  sessionId: string | null;
  session: Session | undefined | null;
  userId: string | null;
  user: User | undefined | null;
  getToken: ServerGetToken;
};

const getAuthData = async (context: any, options: any): Promise<any> => {
  const { loadSession, loadUser } = options;
  const { headers } = context;
  const cookies = parseCookies(headers);
  try {
    const cookieToken = cookies['__session'];
    const headerToken = headers.get('authorization')?.replace('Bearer ', '');
    const { status, sessionClaims, errorReason } = await Clerk.base.getAuthState({
      cookieToken,
      headerToken,
      clientUat: cookies['__client_uat'],
      origin: headers.get('origin'),
      host: headers.get('host') as string,
      forwardedPort: headers.get('x-forwarded-port') as string,
      forwardedHost: headers.get('x-forwarded-host') as string,
      referrer: headers.get('referer'),
      userAgent: headers.get('user-agent') as string,
      fetchInterstitial: () => Promise.resolve(''),
    });

    console.log('getAuthData', {
      headers,
      cookies,
      cookieToken,
      headerToken,
      status,
      sessionClaims,
      errorReason,
    });

    if (status === AuthStatus.Interstitial) {
      return { authData: null, showInterstitial: true };
    }

    if (status === AuthStatus.SignedOut || !sessionClaims) {
      return { authData: createSignedOutState() };
    }

    const sessionId = sessionClaims.sid;
    const userId = sessionClaims.sub;
    const [user, session] = await Promise.all([
      loadUser ? users.getUser(userId) : Promise.resolve(undefined),
      loadSession ? sessions.getSession(sessionId) : Promise.resolve(undefined),
    ]);
    const getToken = createGetToken({
      sessionId,
      cookieToken,
      headerToken,
      fetcher: (...args) => sessions.getToken(...args),
    });
    return { authData: { sessionId, userId, user, session, getToken } };
  } catch (e) {
    return { authData: createSignedOutState() };
  }
};

export const withServerAuth = (cbOrOptions: any, options?: any) => {
  const cb = typeof cbOrOptions === 'function' ? cbOrOptions : undefined;
  const opts = options ? options : typeof cbOrOptions !== 'function' ? cbOrOptions : {};

  return async (context: any) => {
    // TODO 1. get auth data
    const { authData, showInterstitial } = await getAuthData(context, opts);

    if (showInterstitial) {
      return {
        props: { clerkState: { __internal_clerk_state: { ...{ __clerk_ssr_interstitial: true } } } },
      };
    }

    if (!cb) {
      throw new Error('missing implementation cb');
    }

    // TODO  2. inject auth object into args
    // TODO: extract into function, see example in nextjs/remix pkg

    const contextWithAuth = { ...context, auth: authData, user: authData.user, session: authData.session };
    // TODO 3. pass args into callback and get return

    const callbackResult = (await cb?.(contextWithAuth)) || {};

    // TODO  4. merge clerk state with results, ssr state should be into props
    return {
      ...callbackResult,
      props: { ...callbackResult.props, clerkState: { __internal_clerk_state: { __clerk_ssr_state: authData } } },
    };
  };
};
