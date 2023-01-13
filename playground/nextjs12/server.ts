import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({
  path: '.env.local',
});

import { createServer } from 'https';
import next from 'next';
import fs from 'fs';

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { parsePublishableKey } from '@clerk/shared';

const legacyFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API || '';
const publishableKey = parsePublishableKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '');
const url = publishableKey?.frontendApi || legacyFrontendApi;

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';

// const options = {
//   key: fs.readFileSync('/Users/panteliselef/myproxy.elef.dev-key.pem'),
//   cert: fs.readFileSync('/Users/panteliselef/myproxy.elef.dev.pem'),
// };

const options = {
  key: fs.readFileSync('/Users/panteliselef/localhost-key.pem'),
  cert: fs.readFileSync('/Users/panteliselef/localhost.pem'),
};

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const server = express();

app
  .prepare()
  .then(() => {
    // apply proxy in dev mode

    // if (dev) {
    //   server.use(
    //     '/api',
    //     createProxyMiddleware({
    //       target: `https://${url}`,
    //       pathRewrite: {
    //         '^/api/__clerk': '',
    //       },
    //       changeOrigin: true,
    //       prependPath: true,
    //       logLevel: 'debug',
    //       onProxyReq(proxyReq) {
    //         proxyReq.setHeader('Origin', 'https://localhost:4011');
    //       },
    //     }),
    //   );
    // }

    createServer(options, server).listen(port);

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    console.log(`> Server listening at https://${hostname}:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
  })
  .catch(err => {
    console.log('Error', err);
  });
