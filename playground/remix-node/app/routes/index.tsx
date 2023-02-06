import type { LoaderFunction } from '@remix-run/node';
import { getAuth } from '@clerk/remix/ssr.server';
import { useUser, ClerkLoaded, SignedIn, SignedOut } from '@clerk/remix';
import { useLoaderData } from '@remix-run/react';

export const loader: LoaderFunction = async args => {
  const url = new URL(args.request.url);
  url.searchParams.delete('__clerk_synced');
  return {
    ...getAuth(args),
    url,
  };
};

export default function Index() {
  const user = useUser();
  const { url, userId } = useLoaderData();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix</h1>
      <SignedOut>
        <a href={`https://primary.dev/sign-in?redirect_url=${url}`}>Sign In to primary</a>
      </SignedOut>

      <p>
        {userId} {JSON.stringify(user, null, 2)}
      </p>
      <ul>
        <li>
          <a
            target='_blank'
            href='https://remix.run/tutorials/blog'
            rel='noreferrer'
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target='_blank'
            href='https://remix.run/tutorials/jokes'
            rel='noreferrer'
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a
            target='_blank'
            href='https://remix.run/docs'
            rel='noreferrer'
          >
            Remix Docs
          </a>
        </li>
      </ul>
      <div>
        <ul>
          <li>
            Clerkjs loaded:
            <ClerkLoaded>
              <h2>yes</h2>
            </ClerkLoaded>
          </li>
          <li>
            SignedIn:
            <SignedIn>Signed In!</SignedIn>
          </li>
        </ul>
      </div>
    </div>
  );
}
