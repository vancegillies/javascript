import React from 'react';
import { SignIn } from '@clerk/nextjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const SignInPage: NextPage = () => {
  const { query } = useRouter();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <SignIn
        path='/sign-in'
        routing='path'
        redirectUrl={(query?.redirect_url as string) || ''}
      />
    </div>
  );
};

export default SignInPage;
