import { assertFrontendApi } from '../utils';
import { getAuthData } from './getAuthData';
import { assembleInterstitialProps, injectAuthIntoRequest, returnServerAuthResult, sanitizeAuthData } from './utils';

export const withServerAuth = (cbOrOptions: any, options?: any) => {
  const callback = typeof cbOrOptions === 'function' ? cbOrOptions : undefined;
  const opts = options ? options : typeof cbOrOptions !== 'function' ? cbOrOptions : {};

  return async (context: any) => {
    const frontendApi = process.env.CLERK_FRONTEND_API || opts.frontendApi;
    assertFrontendApi(frontendApi);

    const { authData, showInterstitial, errorReason } = await getAuthData(context, opts);

    if (showInterstitial) {
      return assembleInterstitialProps();
    }

    // export to assertCallback
    if (!callback) {
      throw new Error('missing implementation cb');
    }

    const contextWithAuth = injectAuthIntoRequest(context, sanitizeAuthData(authData));
    const callbackResult = (await callback?.(contextWithAuth)) || {};
    return returnServerAuthResult({ authData, frontendApi, errorReason, callbackResult })
  };
};
