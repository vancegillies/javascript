import { NextApiRequest, NextApiResponse } from 'next';
import { parsePublishableKey } from '@clerk/shared';
import httpProxy from 'http-proxy';

//'https://first-hedgehog-27.clerk.accountsstage.dev';
const publishableKey = parsePublishableKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '');
const url = publishableKey?.frontendApi || '';

console.log('----url', url);

// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path, ...rest } = req.query as { path: string[] | undefined };
  // res.setHeader('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '');
  // res.setHeader('Clerk-Proxy-Url', 'http://localhost:4011/api/__clerk');
  // res.setHeader('X-Forwarded-For', '127.0.0.1');

  const q = new URLSearchParams(rest);

  const subpath = path ? '/' + path.join('/') : '';
  const queryParams = q.toString() ? '?' + q.toString() : '';

  return res.redirect(307, `https://${url}${subpath}${queryParams}`);
}

// const proxy = httpProxy.createProxyServer({
//   preserveHeaderKeyCase: true,
//   cookieDomainRewrite: {
//     // 'first-hedgehog-27.accountsstage.dev': 'localhost',
//     // '*': 'localhost',
//     // 'localhost':'first-hedgehog-27.accountsstage.dev',
//   },
//   headers: {
//     'Clerk-Secret-Key': process.env.CLERK_SECRET_KEY || '',
//     'Clerk-Proxy-Url': 'http://localhost:4011/api/__clerk',
//     'X-Forwarded-For': '127.0.0.1',
//   },
// });

// proxy.on('proxyReq', function (proxyReq, req, res, options) {
//   proxyReq.setHeader('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '');
//   proxyReq.setHeader('Clerk-Proxy-Url', 'http://localhost:4011/api/__clerk');
//   proxyReq.setHeader('X-Forwarded-For', '127.0.0.1');
//   // console.log('----proxyReq', res.getHeaders());
//   console.log('----proxyReq', proxyReq.host);
//   console.log('----proxyReq', proxyReq.path);
//   console.log('----req', req.url);
// });

// proxy.on('proxyRes', function (proxyRes, res, req) {
//   console.log('---sttatus', proxyRes.headers);

//   // const headers = proxyRes.headers;
//   if (proxyRes.headers['set-cookie']?.[0]) {
//     proxyRes.headers['set-cookie'][0] = proxyRes.headers['set-cookie'][0].replace('Secure; ', '');
//   }

//   console.log('---cookie', proxyRes.headers['clerk-cookie']);
//   res.headers['clerk-cookie'] = proxyRes.headers['clerk-cookie'];
//   req.setHeader('clerk-cookie', proxyRes.headers['clerk-cookie'] || '');
// });

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { path, ...rest } = req.query as { path: string[] | undefined };
//   res.setHeader('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '');
//   res.setHeader('Clerk-Proxy-Url', 'http://localhost:4011/api/__clerk');
//   res.setHeader('X-Forwarded-For', '127.0.0.1');
//   // res.setHeader(':authority:', url)
//   const q = new URLSearchParams(rest);

//   const subpath = path ? '/' + path.join('/') : '';
//   const queryParams = q.toString() ? '?' + q.toString() : '';

//   req.url = '';

//   return new Promise((resolve, reject) => {
//     proxy.web(req, res, { target: `https://${url}${subpath}${queryParams}`, changeOrigin: true }, err => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(true);
//     });
//   });
// }
