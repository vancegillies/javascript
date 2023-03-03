/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { IsomorphicClerkOptions } from './types';

// @ts-ignore
let props: IsomorphicClerkOptions;
// @ts-expect-no-error
props = {
  frontendApi: '',
};
// @ts-expect-error
props = {
  frontendApi: '',
  publishableKey: '',
};
// @ts-expect-error
props = {};
// @ts-expect-no-error
props = {
  domain: '',
  publishableKey: '',
};

// @ts-expect-error
props = {
  publishableKey: '',
  domain: '',
  proxyUrl: '',
};
