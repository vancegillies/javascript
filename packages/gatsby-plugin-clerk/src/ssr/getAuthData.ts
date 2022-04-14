import cookie from 'cookie';
import { AuthStatus, createGetToken, createSignedOutState, Session, User } from '@clerk/backend-core';
import Clerk, { sessions, users } from '@clerk/clerk-sdk-node';
import { ServerGetToken } from '@clerk/types';

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

type GetAuthDataReturn = {
  authData: AuthData;
  showInterstitial?: undefined;
  errorReason?: string;
} | {
  authData: null;
  showInterstitial: true;
  errorReason?: string;
};

export async function getAuthData(
  context: any,
  options: any
): Promise<GetAuthDataReturn> {
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
      return { authData: null, showInterstitial: true, errorReason };
    }

    if (status === AuthStatus.SignedOut || !sessionClaims) {
      return { authData: createSignedOutState(), errorReason };
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
