import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, ClerkCatchBoundary } from "@clerk/remix";
import styles from "~/styles/shared.css";
import Header from "~/components/Header";

declare global {
  interface Window {
    ENV: {
      CLERK_JS: string;
      CLERK_PUBLISHABLE_KEY: string;
    };
  }
}

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export function links() {
  return [
    { rel: "stylesheet", href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css" },
    { rel: "stylesheet", href: styles },
  ];
}

function getBrowserEnvironment() {
  const env = process.env;

  return {
    CLERK_JS: env.CLERK_JS,
    CLERK_PUBLISHABLE_KEY: env.CLERK_PUBLISHABLE_KEY,
  };
}

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(
    args,
    ({ request }) => {
      const { userId, sessionId, getToken } = request.auth;
      console.log("Root loader auth:", { userId, sessionId, getToken });
      return {
        ENV: getBrowserEnvironment(),
      };
    },
    { loadUser: true }
  );
};

function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App, {
  // @ts-expect-error
  proxyUrl: "playground.lclclerk.com/api/__clerk",
  clerkJSUrl: typeof window !== "undefined" ? window.ENV.CLERK_JS : process.env.CLERK_JS,
});

export const CatchBoundary = ClerkCatchBoundary();
