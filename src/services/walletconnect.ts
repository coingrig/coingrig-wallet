import RNWalletConnect from '@walletconnect/client';

const CLIENT_OPTIONS = {
  clientMeta: {
    description: 'Coingrig Wallet',
    url: 'https://coingrig.com',
    icons: ['https://coingrig.com/assets/logo.png'],
    name: 'Coingrig',
    ssl: true,
  },
};

// let uri = '-- FROM QR CODE --';
// const data: any = {uri};
// data.redirect = '';
// data.autosign = false;
// const wc = new WalletConnectService(data);

class WalletConnectService {
  walletConnector: any;
  constructor(options) {
    this.walletConnector = new RNWalletConnect({...options, ...CLIENT_OPTIONS});
    this.walletConnector.on('session_request', async (error, payload) => {
      if (error) {
        throw error;
      }
      console.log(payload);
      try {
        const sessionData = {
          ...payload.params[0],
          autosign: false,
        };
        console.log('WC:', sessionData);
        setTimeout(async () => {
          // Ask user
          const approveData = {
            chainId: 56,
            accounts: ['0x1301bae64b42bf67697a3d9be51262c962c0b9a7'],
          };
          await this.walletConnector.approveSession(approveData);
        }, 5000);
      } catch (e) {
        this.walletConnector.rejectSession();
      }
    });
    this.walletConnector.on('call_request', async (error, payload) => {
      if (error) {
        throw error;
      }
      console.log(payload);

      if (payload.method) {
        if (payload.method === 'eth_sendTransaction') {
          console.log('-----eth_sendTransaction----');
        } else if (payload.method === 'eth_sign') {
          console.log('-----ETH SIGN----');
        } else if (payload.method === 'personal_sign') {
          console.log('-----personal_sign----');
        } else if (payload.method && payload.method === 'eth_signTypedData') {
          console.log('-----eth_signTypedData----');
        }
      }
    });
    this.walletConnector.on('disconnect', error => {
      if (error) {
        throw error;
      }
      this.walletConnector = null;
      console.log('-----DISCONNECT------');
    });

    this.walletConnector.on('session_update', (error, payload) => {
      console.log('WC: Session update', payload);
      if (error) {
        throw error;
      }
    });
  }
}

export default WalletConnectService;
