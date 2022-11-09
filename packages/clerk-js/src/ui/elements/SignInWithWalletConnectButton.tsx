import QRCodeModal from '@walletconnect/qrcode-modal';
import { SignClient } from '@walletconnect/sign-client';
import { useEffect, useState } from 'react';

export const WalletConnectButton = () => {
  const [client, setClient] = useState<SignClient | null>();
  const [hasInitialized, setHasInitialized] = useState(false);

  const onSignIn = async () => {
    const session = await connect();
    console.log(session);
  };

  const connect = async () => {
    if (!client) {
      return;
    }
    try {
      const { uri, approval } = await client.connect({
        // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
        requiredNamespaces: {
          eip155: {
            methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
            chains: ['eip155:1'],
            events: ['chainChanged', 'accountsChanged'],
          },
        },
      });

      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        QRCodeModal.open(uri, () => {
          console.log('EVENT', 'QR Code Modal closed');
        });
      }

      // Await session approval from the wallet.
      const session = await approval();
      // Handle the returned session (e.g. update UI to "connected" state).
      return session;
      console.log(session);
    } catch (e) {
      console.error(e);
    } finally {
      // Close the QRCode modal in case it was open.
      QRCodeModal.close();
    }
  };

  useEffect(() => {
    SignClient.init({
      projectId: '1d5b36cedba275b0f178b8225d935c0d',
      metadata: {
        name: 'Clerk Develop',
        description: 'A Clerk development instance.',
        url: 'https://clerk.dev',
        icons: ['https://clerk.dev/images/clerk-logo.svg'],
      },
    })
      .then(signClient => {
        setClient(signClient);
        setHasInitialized(true);
      })
      .catch(console.error);
  }, []);

  return <button onClick={onSignIn}>Sign in with WalletConnect</button>;
};
