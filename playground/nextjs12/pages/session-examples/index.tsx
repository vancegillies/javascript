import type { NextPage } from 'next';
import React from 'react';
import { withSession, WithSessionProp } from '@clerk/nextjs';

class SessionExample extends React.Component<WithSessionProp> {
  render() {
    return <div>{JSON.stringify(this.props.session.publicUserData)}</div>;
  }
}

export const WithSessionHOCExample = withSession(SessionExample);

const SessionExamplesPage: NextPage = () => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}
    >
      <WithSessionHOCExample />
    </div>
  );
};

export default SessionExamplesPage;
