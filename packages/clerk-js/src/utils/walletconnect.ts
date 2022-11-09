import QRCodeModal from '@walletconnect/qrcode-modal';
import SignClient from '@walletconnect/sign-client';

export default class WalletConnect {
  signClient: SignClient;

  constructor(signClient: SignClient) {
    this.signClient = signClient;
  }

  static async signClient() {
    const signClient = await SignClient.init({
      projectId: '1d5b36cedba275b0f178b8225d935c0d',
      metadata: {
        name: 'Clerk Develop',
        description: 'A Clerk development instance.',
        url: 'https://clerl.dev',
        icons: ['https://clerk.dev/images/clerk-logo.svg'],
      },
    });

    console.log(signClient.session);

    return new WalletConnect(signClient);
  }

  async connect() {
    try {
      const { uri, approval } = await this.signClient.connect({
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
      console.log(session);
    } catch (e) {
      console.error(e);
    } finally {
      // Close the QRCode modal in case it was open.
      QRCodeModal.close();
    }
  }
}
