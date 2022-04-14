
import type { AuthData } from './getAuthData';
import type { GetServerDataProps } from "gatsby"
import { GetServerDataPropsWithAuth } from './types';

export function assembleInterstitialProps() {
  return {
    props: { clerkState: { __internal_clerk_state: { ...{ __clerk_ssr_interstitial: true } } } },
  };
}

export function injectAuthIntoRequest(context: GetServerDataProps, authData: AuthData): GetServerDataPropsWithAuth {
  if (!authData) {
    return context;
  }

  const { user, ...restAuthData } = authData;
  return {
    ...context, auth: restAuthData, user: user
  }
}

/**
 * See `packages/nextjs/src/middleware/utils/sanitizeAuthData.ts`
 * TODO: Make a shared function
 *
 * @internal
 */
export function sanitizeAuthData(authData: AuthData): any {
  const user = authData.user ? { ...authData.user } : authData.user;
  if (user) {
    // @ts-expect-error;
    delete user['privateMetadata'];
  }
  return { ...authData, user };
}

/**
 * @internal
 */
export const returnServerAuthResult = (opts: {
  authData: AuthData | null;
  frontendApi: string;
  errorReason: string | undefined;
  callbackResult?: any;
}) => {
  return {
    ...(opts.callbackResult || {}),
    ...wrapWithClerkState({
      __clerk_ssr_state: opts.authData,
      __frontendApi: opts.frontendApi,
      __lastAuthResult: opts.errorReason || '',
    }),
  };
};

/**
 * Wraps obscured clerk internals with a readable `clerkState` key.
 * This is intended to be passed by the user into <ClerkProvider>
 *
 * @internal
 */
export const wrapWithClerkState = (data: any) => {
  return { clerkState: { __internal_clerk_state: { ...data } } };
};
