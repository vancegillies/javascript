import { camelToSnake, runWithExponentialBackOff } from '@clerk/shared';
import type { Clerk, ClerkAPIErrorJSON, ClientJSON } from '@clerk/types';
import qs from 'qs';

import { buildEmailAddress as buildEmailAddressUtil, buildURL as buildUrlUtil } from '../utils';
import { clerkNetworkError } from './errors';

export type HTTPMethod = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';

export type FapiRequestInit = RequestInit & {
  path?: string;
  search?: string | URLSearchParams | string[][] | Record<string, string> | undefined;
  sessionId?: string;
  rotatingTokenNonce?: string;
  url?: URL;
};

type FapiQueryStringParameters = {
  _method?: string;
  _clerk_session_id?: string;
  _clerk_js_version?: string;
  rotating_token_nonce?: string;
};

export type FapiResponse<T> = Response & {
  payload: FapiResponseJSON<T> | null;
};

export type FapiRequestCallback<T> = (
  request: FapiRequestInit,
  response?: FapiResponse<T>,
) => Promise<unknown | false> | unknown | false;

const camelToSnakeEncoder: qs.IStringifyOptions['encoder'] = (str, defaultEncoder, _, type) => {
  return type === 'key' ? camelToSnake(str) : defaultEncoder(str);
};

// TODO: Move to @clerk/types
export interface FapiResponseJSON<T> {
  response: T;
  client?: ClientJSON;
  errors?: ClerkAPIErrorJSON[];
  meta?: {
    client?: ClientJSON;
    session_id?: string;
    responseHeaders?: { country: string | null };
  };
}

export interface FapiClient {
  buildUrl(requestInit: FapiRequestInit): URL;

  buildEmailAddress(localPart: string): string;

  onAfterResponse(callback: FapiRequestCallback<unknown>): void;

  onBeforeRequest(callback: FapiRequestCallback<unknown>): void;

  request<T>(requestInit: FapiRequestInit): Promise<FapiResponse<T>>;
}

export default function createFapiClient(clerkInstance: Omit<Clerk, 'proxyUrl'>): FapiClient {
  const onBeforeRequestCallbacks: Array<FapiRequestCallback<unknown>> = [];
  const onAfterResponseCallbacks: Array<FapiRequestCallback<unknown>> = [];

  function onBeforeRequest(callback: FapiRequestCallback<unknown>) {
    onBeforeRequestCallbacks.push(callback);
  }

  function onAfterResponse(callback: FapiRequestCallback<unknown>) {
    onAfterResponseCallbacks.push(callback);
  }

  async function runBeforeRequestCallbacks(requestInit: FapiRequestInit) {
    const windowCallback = typeof window !== 'undefined' && (window as any).__unstable__onBeforeRequest;
    for await (const callback of [windowCallback, ...onBeforeRequestCallbacks].filter(s => s)) {
      if ((await callback(requestInit)) === false) {
        return false;
      }
    }
    return true;
  }

  async function runAfterResponseCallbacks(requestInit: FapiRequestInit, response: FapiResponse<unknown>) {
    const windowCallback = typeof window !== 'undefined' && (window as any).__unstable__onAfterResponse;
    for await (const callback of [windowCallback, ...onAfterResponseCallbacks].filter(s => s)) {
      if ((await callback(requestInit, response)) === false) {
        return false;
      }
    }
    return true;
  }

  function buildQueryString({ method, path, sessionId, search, rotatingTokenNonce }: FapiRequestInit) {
    const searchParams = new URLSearchParams(search);
    if (clerkInstance.version) {
      searchParams.append('_clerk_js_version', clerkInstance.version);
    }

    if (rotatingTokenNonce) {
      searchParams.append('rotating_token_nonce', rotatingTokenNonce);
    }

    // Due to a known Safari bug regarding CORS requests, we are forced to always use GET or POST method.
    // The original HTTP method is used as a query string parameter instead of as an actual method to
    // avoid triggering a CORS OPTION request as it currently breaks cookie dropping in Safari.
    if (!!method && method !== 'GET' && method !== 'POST') {
      searchParams.append('_method', method);
    }

    if (path && !path.startsWith('/client') && sessionId) {
      searchParams.append('_clerk_session_id', sessionId);
    }

    // TODO: extract to generic helper
    const objParams = [...searchParams.entries()].reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {} as FapiQueryStringParameters & Record<string, string>);

    return qs.stringify(objParams, { addQueryPrefix: true });
  }

  function buildUrl(requestInit: FapiRequestInit): URL {
    const { path } = requestInit;

    const { proxyUrl } = clerkInstance as Clerk;

    if (proxyUrl) {
      const proxyBase = new URL(proxyUrl);
      const proxyPath = proxyBase.pathname.slice(1, proxyBase.pathname.length);
      return buildUrlUtil(
        {
          base: proxyBase.origin,
          pathname: `${proxyPath}/v1${path}`,
          search: buildQueryString(requestInit),
        },
        { stringify: false },
      );
    }

    return buildUrlUtil(
      {
        base: `https://${clerkInstance.domain || clerkInstance.frontendApi}`,
        pathname: `v1${path}`,
        search: buildQueryString(requestInit),
      },
      { stringify: false },
    );
  }

  function buildEmailAddress(localPart: string): string {
    return buildEmailAddressUtil({
      localPart,
      frontendApi: clerkInstance.frontendApi,
    });
  }

  async function request<T>(requestInit: FapiRequestInit): Promise<FapiResponse<T>> {
    // eslint-disable-next-line prefer-const
    let { method = 'GET', body } = requestInit;

    requestInit.url = buildUrl({
      ...requestInit,
      // TODO: Pass these values to the FAPI client instead of calculating them on the spot
      sessionId: clerkInstance.session?.id,
    });

    if (!requestInit.headers) {
      requestInit.headers = new Headers();
    }

    // In case FormData is provided, we don't want to mess with the headers,
    // because for file uploads the header is properly set by the browser.
    if (method !== 'GET' && !(body instanceof FormData)) {
      requestInit.body = qs.stringify(body, { encoder: camelToSnakeEncoder, indices: false });
      // @ts-ignore
      requestInit.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    const beforeRequestCallbacksResult = await runBeforeRequestCallbacks(requestInit);
    // Due to a known Safari bug regarding CORS requests, we are forced to always use GET or POST method.
    // The original HTTP method is used as a query string parameter instead of as an actual method to
    // avoid triggering a CORS OPTION request as it currently breaks cookie dropping in Safari.
    const overwrittenRequestMethod = method === 'GET' ? 'GET' : 'POST';
    let response: Response;
    const urlStr = requestInit.url.toString();
    const fetchOpts: FapiRequestInit = {
      ...requestInit,
      credentials: 'include',
      method: overwrittenRequestMethod,
    };

    try {
      if (beforeRequestCallbacksResult) {
        response =
          // retry only on GET requests for safety
          overwrittenRequestMethod === 'GET'
            ? await runWithExponentialBackOff(() => fetch(urlStr, fetchOpts), {
                maxRetries: 6,
                firstDelay: 500,
                maxDelay: 5000,
              })
            : await fetch(urlStr, fetchOpts);
      } else {
        response = new Response('{}', requestInit); // Mock an empty json response
      }
    } catch (e) {
      clerkNetworkError(urlStr, e);
    }

    const responseHeaders = {
      country: response.headers.get('x-country'),
    };

    const json: FapiResponseJSON<T> = await response.json();
    const fapiResponse: FapiResponse<T> = Object.assign(response, { payload: json });
    if (fapiResponse.payload) {
      fapiResponse.payload.meta = { ...json?.meta, responseHeaders };
    }
    await runAfterResponseCallbacks(requestInit, fapiResponse);
    return fapiResponse;
  }

  return {
    buildEmailAddress,
    buildUrl,
    onAfterResponse,
    onBeforeRequest,
    request,
  };
}
