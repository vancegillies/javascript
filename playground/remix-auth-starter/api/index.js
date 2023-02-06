'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: !0 });
  },
  __copyProps = (to, from, except, desc) => {
    if ((from && typeof from == 'object') || typeof from == 'function')
      for (let key of __getOwnPropNames(from))
        !__hasOwnProp.call(to, key) &&
          key !== except &&
          __defProp(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    return to;
  };
var __toCommonJS = mod => __copyProps(__defProp({}, '__esModule', { value: !0 }), mod);

// server.js
var server_exports = {};
__export(server_exports, {
  default: () => server_default,
});
module.exports = __toCommonJS(server_exports);
var import_vercel = require('@remix-run/vercel');

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes,
});

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest,
});
var import_server = require('react-dom/server'),
  import_react = require('@remix-run/react'),
  import_jsx_runtime = require('react/jsx-runtime');
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.RemixServer, { context: remixContext, url: request.url }),
  );
  return (
    responseHeaders.set('Content-Type', 'text/html'),
    new Response('<!DOCTYPE html>' + markup, {
      status: responseStatusCode,
      headers: responseHeaders,
    })
  );
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  CatchBoundary: () => CatchBoundary,
  default: () => root_default,
  links: () => links,
  loader: () => loader,
  meta: () => meta,
});
var import_react3 = require('@remix-run/react'),
  import_ssr = require('@clerk/remix/ssr.server'),
  import_remix2 = require('@clerk/remix');

// app/styles/shared.css
var shared_default = '/build/_assets/shared-3LW4TL4P.css';

// app/components/Header.tsx
var import_remix = require('@clerk/remix'),
  import_react2 = require('@remix-run/react'),
  import_jsx_runtime2 = require('react/jsx-runtime'),
  Header = () =>
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)('header', {
      className: 'header',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)('div', {
          className: 'left',
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react2.Link, {
            to: '/',
            className: 'logo',
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)('img', {
                src: '/logo.svg',
                width: '32',
                height: '32',
                alt: 'Logo',
              }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)('span', {
                className: 'appName',
                children: 'Your application',
              }),
            ],
          }),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)('div', {
          className: 'right',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remix.SignedOut, {
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, {
                to: '/sign-in',
                children: 'Sign in',
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remix.SignedIn, {
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remix.UserButton, {
                userProfileUrl: '/user',
                afterSignOutUrl: '/',
              }),
            }),
          ],
        }),
      ],
    }),
  Header_default = Header;

// app/root.tsx
var import_jsx_runtime3 = require('react/jsx-runtime'),
  meta = () => ({ title: 'New Remix App' });
function links() {
  return [
    { rel: 'stylesheet', href: 'https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css' },
    { rel: 'stylesheet', href: shared_default },
  ];
}
function getBrowserEnvironment() {
  let env = process.env;
  return {
    CLERK_JS: env.CLERK_JS,
    CLERK_PUBLISHABLE_KEY: env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: env.CLERK_SECRET_KEY,
  };
}
var loader = args =>
  (0, import_ssr.rootAuthLoader)(
    args,
    ({ request }) => {
      let { userId, sessionId, getToken } = request.auth;
      return (
        console.log('Root loader auth:', { userId, sessionId, getToken }),
        {
          ENV: getBrowserEnvironment(),
        }
      );
    },
    { loadUser: !0 },
  );
function App() {
  let data = (0, import_react3.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)('html', {
    lang: 'en',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)('head', {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)('meta', { charSet: 'utf-8' }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)('meta', {
            name: 'viewport',
            content: 'width=device-width,initial-scale=1',
          }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Meta, {}),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Links, {}),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)('body', {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Header_default, {}),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Outlet, {}),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)('script', {
            dangerouslySetInnerHTML: {
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            },
          }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.ScrollRestoration, {}),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Scripts, {}),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.LiveReload, {}),
        ],
      }),
    ],
  });
}
var root_default = (0, import_remix2.ClerkApp)(App, {
    proxyUrl: 'playground.lclclerk.com/api/__clerk',
    clerkJSUrl: typeof window < 'u' ? window.ENV.CLERK_JS : process.env.CLERK_JS,
  }),
  CatchBoundary = (0, import_remix2.ClerkCatchBoundary)();

// app/routes/ssr-user-demo.tsx
var ssr_user_demo_exports = {};
__export(ssr_user_demo_exports, {
  default: () => SsrDemoPage,
  loader: () => loader2,
});
var import_node = require('@remix-run/node'),
  import_react4 = require('@remix-run/react'),
  import_ssr2 = require('@clerk/remix/ssr.server'),
  import_api = require('@clerk/remix/api.server'),
  import_jsx_runtime4 = require('react/jsx-runtime'),
  loader2 = async ({ request }) => {
    let { userId } = await (0, import_ssr2.getAuth)(request);
    if (!userId) return (0, import_node.redirect)('/sign-in?redirect_url=' + request.url);
    let user = await import_api.users.getUser(userId);
    return { serialisedUser: JSON.stringify(user) };
  };
function SsrDemoPage() {
  let { serialisedUser } = (0, import_react4.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)('div', {
    className: 'container',
    children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)('main', {
      className: 'main',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)('h1', {
          className: 'title',
          children: 'SSR Demo page with /api.server',
        }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)('p', {
          className: 'description',
          children: 'This route has a loader that fetches the user on the server-side.',
        }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)('p', {
          className: 'description',
          children:
            'If you only intend to use the `user` object on the client-side, you most probably want to simply use the `useUser` hook instead.',
        }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)('div', {
          className: 'preContainer',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)('h2', { children: 'useLoaderData hook' }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)('p', {
              className: 'description',
              children: 'The loader uses getAuth to get the userId and users.getUser to fetch the user object',
            }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)('pre', {
              children: JSON.stringify({ serialisedUser }, null, 2),
            }),
          ],
        }),
      ],
    }),
  });
}

// app/routes/sign-in/$.tsx
var __exports = {};
__export(__exports, {
  default: () => SignInPage,
});
var import_remix3 = require('@clerk/remix'),
  import_jsx_runtime5 = require('react/jsx-runtime');
function SignInPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)('div', {
    className: 'container',
    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_remix3.SignIn, {
      path: '/sign-in',
      routing: 'path',
      signUpUrl: '/sign-up',
    }),
  });
}

// app/routes/sign-up/$.tsx
var __exports2 = {};
__export(__exports2, {
  default: () => SignUpPage,
});
var import_remix4 = require('@clerk/remix'),
  import_jsx_runtime6 = require('react/jsx-runtime');
function SignUpPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)('div', {
    className: 'container',
    children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_remix4.SignUp, {
      path: '/sign-up',
      routing: 'path',
      signInUrl: '/sign-in',
    }),
  });
}

// app/routes/ssr-demo.tsx
var ssr_demo_exports = {};
__export(ssr_demo_exports, {
  default: () => SsrDemoPage2,
  loader: () => loader3,
});
var import_node2 = require('@remix-run/node'),
  import_react5 = require('@remix-run/react'),
  import_remix5 = require('@clerk/remix'),
  import_ssr3 = require('@clerk/remix/ssr.server'),
  import_jsx_runtime7 = require('react/jsx-runtime'),
  mockGetPosts = userId => Promise.resolve([{ title: 'A Post', content: 'Hello from Clerk + Remix' }]),
  loader3 = async ({ request }) => {
    let { userId, sessionId, getToken } = await (0, import_ssr3.getAuth)(request);
    return (
      console.log('Use getAuth() to access the auth state:', userId, sessionId, getToken),
      userId
        ? { posts: await mockGetPosts(userId) }
        : (0, import_node2.redirect)('/sign-in?redirect_url=' + request.url)
    );
  };
function SsrDemoPage2() {
  let { isSignedIn, isLoaded, user } = (0, import_remix5.useUser)(),
    { posts } = (0, import_react5.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('div', {
    className: 'container',
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)('main', {
      className: 'main',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('h1', { className: 'title', children: 'SSR Demo page' }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('p', {
          className: 'description',
          children:
            'This page and any displayed data are fully rendered on the server side. Reload this page to try it out.',
        }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)('div', {
          className: 'preContainer',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('h2', { children: 'useLoaderData hook' }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('p', {
              className: 'description',
              children: 'The loader uses getAuth to get the userId and fetch the posts from a remote database',
            }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('pre', { children: JSON.stringify({ posts }, null, 2) }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)('div', {
          className: 'preContainer',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('h2', { children: 'useUser hook' }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)('p', {
              className: 'description',
              children: [
                'Passing ',
                '{ loadUser: true }',
                ' to the root loader makes all Clerk data available both during SSR and CSR',
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('pre', { children: JSON.stringify({ isLoaded }) }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('pre', { children: JSON.stringify({ isSignedIn }) }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)('pre', { children: JSON.stringify({ user }, null, 2) }),
          ],
        }),
      ],
    }),
  });
}

// app/routes/user/$.tsx
var __exports3 = {};
__export(__exports3, {
  default: () => UserProfilePage,
});
var import_remix6 = require('@clerk/remix'),
  import_jsx_runtime8 = require('react/jsx-runtime');
function UserProfilePage() {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_remix6.UserProfile, { path: '/user', routing: 'path' });
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index,
});
var import_remix7 = require('@clerk/remix'),
  import_react6 = require('@remix-run/react'),
  import_jsx_runtime9 = require('react/jsx-runtime'),
  ClerkFeatures = () =>
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_react6.Link, {
      to: '/user',
      className: 'cardContent',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', { src: '/icons/layout.svg' }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('div', {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('h3', { children: 'Explore features provided by Clerk' }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('p', {
              children: 'Interact with the user button, user profile, and more to preview what your users will see',
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('div', {
          className: 'arrow',
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', { src: '/icons/arrow-right.svg' }),
        }),
      ],
    }),
  SsrDemoLink = () =>
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_react6.Link, {
      to: '/ssr-demo',
      className: 'cardContent',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', { src: '/icons/layout.svg' }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('div', {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('h3', { children: 'Visit the SSR demo page' }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('p', {
              children:
                'See how Clerk hydrates the auth state during SSR and CSR, enabling server-side generation even for authenticated pages',
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('div', {
          className: 'arrow',
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', { src: '/icons/arrow-right.svg' }),
        }),
      ],
    }),
  SignupLink = () =>
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_react6.Link, {
      to: '/sign-up',
      className: 'cardContent',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', { src: '/icons/user-plus.svg' }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('div', {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('h3', { children: 'Sign up for an account' }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('p', {
              children: 'Sign up and sign in to explore all the features provided by Clerk out-of-the-box',
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('div', {
          className: 'arrow',
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', { src: '/icons/arrow-right.svg' }),
        }),
      ],
    }),
  Main = () =>
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('main', {
      className: 'main',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('h1', { className: 'title', children: 'Welcome to your new app' }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remix7.SignedIn, {
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('p', {
            className: 'description',
            children: 'You have successfully signed in',
          }),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remix7.SignedOut, {
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('p', {
            className: 'description',
            children: 'Sign up for an account to get started',
          }),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('div', {
          className: 'cards',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remix7.SignedIn, {
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('div', {
                className: 'card',
                children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ClerkFeatures, {}),
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remix7.SignedIn, {
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('div', {
                className: 'card',
                children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SsrDemoLink, {}),
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remix7.SignedOut, {
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('div', {
                className: 'card',
                children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SignupLink, {}),
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('div', {
              className: 'card',
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('a', {
                href: 'https://dashboard.clerk.dev/last-active?utm_source=github&utm_medium=starter_repos&utm_campaign=remix_starter',
                target: '_blank',
                rel: 'noreferrer',
                className: 'cardContent',
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', { src: '/icons/settings.svg' }),
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('div', {
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('h3', {
                        children: 'Configure settings for your app',
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('p', {
                        children:
                          'Visit Clerk to manage instances and configure settings for user management, theme, and more',
                      }),
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('div', {
                    className: 'arrow',
                    children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', { src: '/icons/arrow-right.svg' }),
                  }),
                ],
              }),
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('div', {
          className: 'links',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('a', {
              href: 'https://clerk.dev/docs?utm_source=github&utm_medium=starter_repos&utm_campaign=remix_starter',
              target: '_blank',
              rel: 'noreferrer',
              className: 'link',
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('span', {
                className: 'linkText',
                children: 'Read Clerk documentation',
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('a', {
              href: 'https://remixjs.org/docs',
              target: '_blank',
              rel: 'noreferrer',
              className: 'link',
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('span', {
                className: 'linkText',
                children: 'Read Remix documentation',
              }),
            }),
          ],
        }),
      ],
    }),
  Footer = () =>
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('footer', {
      className: 'footer',
      children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('a', {
        href: 'https://github.com/clerkinc/clerk-remix-starter',
        target: '_blank',
        rel: 'noopener noreferrer',
        children: [
          'Powered by ',
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', {
            src: '/clerk.svg',
            alt: 'Clerk.dev',
            className: 'footer-logo',
          }),
          '+',
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)('img', {
            src: '/remix.svg',
            alt: 'Remix',
            className: 'footer-logo-remix',
          }),
        ],
      }),
    });
function Index() {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)('div', {
    className: 'container',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Main, {}),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Footer, {}),
    ],
  });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = {
  version: '79d48318',
  entry: { module: '/build/entry.client-6I773I7A.js', imports: ['/build/_shared/chunk-S37C2UTC.js'] },
  routes: {
    root: {
      id: 'root',
      parentId: void 0,
      path: '',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/root-YKJ6JFSI.js',
      imports: ['/build/_shared/chunk-PFHD3R2F.js', '/build/_shared/chunk-HYQEZWOI.js'],
      hasAction: !1,
      hasLoader: !0,
      hasCatchBoundary: !0,
      hasErrorBoundary: !1,
    },
    'routes/index': {
      id: 'routes/index',
      parentId: 'root',
      path: void 0,
      index: !0,
      caseSensitive: void 0,
      module: '/build/routes/index-GIJFQ6GA.js',
      imports: void 0,
      hasAction: !1,
      hasLoader: !1,
      hasCatchBoundary: !1,
      hasErrorBoundary: !1,
    },
    'routes/sign-in/$': {
      id: 'routes/sign-in/$',
      parentId: 'root',
      path: 'sign-in/*',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/sign-in/$-XFYWHQYI.js',
      imports: void 0,
      hasAction: !1,
      hasLoader: !1,
      hasCatchBoundary: !1,
      hasErrorBoundary: !1,
    },
    'routes/sign-up/$': {
      id: 'routes/sign-up/$',
      parentId: 'root',
      path: 'sign-up/*',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/sign-up/$-V3ON622W.js',
      imports: void 0,
      hasAction: !1,
      hasLoader: !1,
      hasCatchBoundary: !1,
      hasErrorBoundary: !1,
    },
    'routes/ssr-demo': {
      id: 'routes/ssr-demo',
      parentId: 'root',
      path: 'ssr-demo',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/ssr-demo-35XQG2TF.js',
      imports: void 0,
      hasAction: !1,
      hasLoader: !0,
      hasCatchBoundary: !1,
      hasErrorBoundary: !1,
    },
    'routes/ssr-user-demo': {
      id: 'routes/ssr-user-demo',
      parentId: 'root',
      path: 'ssr-user-demo',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/ssr-user-demo-A6IE7ROZ.js',
      imports: void 0,
      hasAction: !1,
      hasLoader: !0,
      hasCatchBoundary: !1,
      hasErrorBoundary: !1,
    },
    'routes/user/$': {
      id: 'routes/user/$',
      parentId: 'root',
      path: 'user/*',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/user/$-64UMG2E5.js',
      imports: void 0,
      hasAction: !1,
      hasLoader: !1,
      hasCatchBoundary: !1,
      hasErrorBoundary: !1,
    },
  },
  cssBundleHref: void 0,
  url: '/build/manifest-79D48318.js',
};

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = 'public/build',
  future = {
    unstable_cssModules: !1,
    unstable_cssSideEffectImports: !1,
    unstable_vanillaExtract: !1,
    v2_errorBoundary: !1,
    v2_meta: !1,
    v2_routeConvention: !1,
  },
  publicPath = '/build/',
  entry = { module: entry_server_exports },
  routes = {
    root: {
      id: 'root',
      parentId: void 0,
      path: '',
      index: void 0,
      caseSensitive: void 0,
      module: root_exports,
    },
    'routes/ssr-user-demo': {
      id: 'routes/ssr-user-demo',
      parentId: 'root',
      path: 'ssr-user-demo',
      index: void 0,
      caseSensitive: void 0,
      module: ssr_user_demo_exports,
    },
    'routes/sign-in/$': {
      id: 'routes/sign-in/$',
      parentId: 'root',
      path: 'sign-in/*',
      index: void 0,
      caseSensitive: void 0,
      module: __exports,
    },
    'routes/sign-up/$': {
      id: 'routes/sign-up/$',
      parentId: 'root',
      path: 'sign-up/*',
      index: void 0,
      caseSensitive: void 0,
      module: __exports2,
    },
    'routes/ssr-demo': {
      id: 'routes/ssr-demo',
      parentId: 'root',
      path: 'ssr-demo',
      index: void 0,
      caseSensitive: void 0,
      module: ssr_demo_exports,
    },
    'routes/user/$': {
      id: 'routes/user/$',
      parentId: 'root',
      path: 'user/*',
      index: void 0,
      caseSensitive: void 0,
      module: __exports3,
    },
    'routes/index': {
      id: 'routes/index',
      parentId: 'root',
      path: void 0,
      index: !0,
      caseSensitive: void 0,
      module: routes_exports,
    },
  };

// server.js
var server_default = (0, import_vercel.createRequestHandler)({ build: server_build_exports, mode: 'production' });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
