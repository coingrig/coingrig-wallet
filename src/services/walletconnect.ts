import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletConnectClient from '@walletconnect/client';
import {CLIENT_EVENTS} from '@walletconnect/client';
import {SessionTypes} from '@walletconnect/types';

// const wc = new WalletConnectService();
// setTimeout(() => {
//   const uri =
//     'wc:bd39b01d-c861-438c-afd7-d6d4d9ee5815@1?bridge=https%3A%2F%2Fe.bridge.walletconnect.org&key=df479188ca9116bdfcb7d2d8600190cb5e0944da3948b4e119f1a79d97cf4c47';
//   console.log(
//     '---------------------------------------------------------------',
//   );
//   wc.client.pair({uri});
// }, 5000);

class WalletConnectService {
  client: any;
  constructor() {
    this.init();
  }
  init = async () => {
    //@ts-ignore
    this.client = await WalletConnectClient.init({
      //   logger: 'debug',
      apiKey: '3c5e5b9fc6a64c31f8e7cd697bf541da',
      controller: true,
      relayProvider: 'wss://relay.walletconnect.com',
      metadata: {
        name: 'Test Wallet',
        description: 'Test Wallet',
        url: '#',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
      },
      storageOptions: {
        //@ts-ignore
        asyncStorage: AsyncStorage,
      },
    });
    //start listen
    this.client.on(CLIENT_EVENTS.pairing.proposal, async proposal => {
      console.log('pairing.proposal', proposal);
    });

    this.client.on(CLIENT_EVENTS.pairing.created, async proposal => {
      console.log('pairing.created', proposal);
    });

    this.client.on(
      CLIENT_EVENTS.session.created,
      async (session: SessionTypes.Created) => {
        // session created succesfully
        console.log('session---------', session);
      },
    );
  };
  handleSessionUserApproval = async (
    approved: boolean,
    proposal: SessionTypes.Proposal,
  ) => {
    if (true) {
      // if user approved then include response with accounts matching the chains and wallet metadata
      const response: SessionTypes.Response = {
        state: {
          accounts: ['eip155:1:0x1d85568eEAbad713fBB5293B45ea066e552A90De'],
        },
      };
      await this.client.approve({proposal, response});
    } else {
      // if user didn't approve then reject with no response
      await this.client.reject({proposal});
    }
  };
}

export default WalletConnectService;
