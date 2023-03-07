/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { IsomorphicClerkOptions } from './types';

// @ts-ignore
let props: IsomorphicClerkOptions;

// @ts-expect-error
props = {};

// @ts-expect-no-error
props = {
  frontendApi: '',
};

// @ts-expect-no-error
props = {
  publishableKey: '',
};

// @ts-expect-error
props = {
  frontendApi: '',
  publishableKey: '',
};

// @ts-expect-error
props = {
  domain: '',
  publishableKey: '',
};

// @ts-expect-no-error
props = {
  publishableKey: '',
  isSatellite: true,
  domain: '',
};

// @ts-expect-error
props = {
  publishableKey: '',
  domain: '',
  proxyUrl: '',
};

// @ts-expect-error
props = {
  isSatellite: true,
  publishableKey: '',
  domain: '',
  proxyUrl: '',
};

// @ts-expect-error
props = {
  isSatellite: true,
  publishableKey: '',
};

// @ts-expect-error
props = {
  isSatellite: _ => true,
  publishableKey: '',
  domain: '',
  proxyUrl: '',
};

// @ts-expect-no-error
props = {
  isSatellite: _ => true,
  publishableKey: '',
  domain: '',
};

// @ts-expect-no-error
props = {
  publishableKey: '',
  proxyUrl: '',
};

// @ts-expect-no-error
props = {
  isSatellite: _ => true,
  publishableKey: '',
  proxyUrl: '',
};
