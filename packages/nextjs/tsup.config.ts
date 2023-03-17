import { defineConfig } from 'tsup';

import { name, version } from './package.json';

export default defineConfig(overrideOptions => {
  const isProd = overrideOptions.env?.NODE_ENV === 'production';

  return {
    entry: ['src/index.ts', 'src/ssr/index.ts', 'src/server/index.ts', 'src/api/index.ts', 'src/client/index.ts'],
    minify: isProd,
    sourcemap: true,
    format: ['cjs', 'esm'],
    // Uncomment this to get metafiles for esbuild bundle analysis
    // metafile: true,
    define: {
      PACKAGE_NAME: `"${name}"`,
      PACKAGE_VERSION: `"${version}"`,
      __DEV__: `${!isProd}`,
    },
    legacyOutput: true,
  };
});
