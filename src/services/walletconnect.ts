/* eslint-disable @typescript-eslint/no-unused-vars */
import RNWalletConnect from '@walletconnect/client';
import {WalletconnectStore} from '../stores/walletconnect';

const CLIENT_OPTIONS = {
  clientMeta: {
    description: 'Coingrig Wallet',
    url: 'https://coingrig.com',
    icons: ['https://coingrig.com/assets/logo.png'],
    name: 'Coingrig',
    ssl: true,
  },
};

export const WALLETCONNECT_STATUS = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  SESSION_REQUEST: 'session_request',
  SEND_TRANSACTION: 'send_transaction',
  SIGN_TRANSACTION: 'sign_transaction',
  SIGN_MESSAGE: 'sign_message',
  SIGN_TYPED_DATA: 'sign_typed_data',
  SIGN_PERSONAL_MESSAGE: 'sign_personal_message',
  DISCONNECTED: 'disconnected',
};

// let uri = '-- FROM QR CODE --';
// const data: any = {uri};
// data.redirect = '';
// data.autosign = false;
// const wc = new WalletConnectService(data);

class WalletConnectService {
  walletConnector: any;
  constructor() {}

  rejectSession = async () => {
    if (this.walletConnector) {
      await this.walletConnector.rejectSession();
    }
  };

  acceptSession = async (chainId, address) => {
    if (this.walletConnector) {
      const approveData = {
        chainId: chainId,
        accounts: [address],
      };
      WalletconnectStore.setStatus(WALLETCONNECT_STATUS.CONNECTED);
      await this.walletConnector.approveSession(approveData);
    }
  };

  closeSession = async () => {
    if (this.walletConnector) {
      this.walletConnector.killSession();
    }
  };

  approveRequest = async data => {
    this.walletConnector.approveRequest(data);
    WalletconnectStore.setStatus(WALLETCONNECT_STATUS.CONNECTED);
    WalletconnectStore.setTransactionData(null);
  };

  rejectRequest = async data => {
    this.walletConnector.rejectRequest(data);
    WalletconnectStore.setStatus(WALLETCONNECT_STATUS.CONNECTED);
    WalletconnectStore.setTransactionData(null);
  };

  onDisconnect() {
    WalletconnectStore.setPeerMeta(null);
    WalletconnectStore.setChainId(null);
    WalletconnectStore.setStatus(WALLETCONNECT_STATUS.DISCONNECTED);
  }

  init(options) {
    if (this.walletConnector) {
      // Disconnect previous connection
      this.walletConnector.killSession();
    }
    WalletconnectStore.setStatus(WALLETCONNECT_STATUS.CONNECTING);
    try {
      this.walletConnector = new RNWalletConnect({
        ...options,
        ...CLIENT_OPTIONS,
      });
    } catch (e) {
      WalletconnectStore.setStatus(WALLETCONNECT_STATUS.DISCONNECTED);
      console.log(e);
      return false;
    }
    this.walletConnector.on('session_request', async (error, payload) => {
      if (error) {
        throw error;
      }
      try {
        const sessionData = {
          ...payload.params[0],
          autosign: false,
        };
        WalletconnectStore.setPeerMeta(sessionData.peerMeta);
        WalletconnectStore.setChainId(sessionData.chainId);
        WalletconnectStore.setStatus(WALLETCONNECT_STATUS.SESSION_REQUEST);
      } catch (e) {
        console.log(e);
        this.walletConnector.rejectSession();
      }
    });
    this.walletConnector.on('call_request', async (error, payload) => {
      if (error) {
        throw error;
      }

      if (payload.method) {
        WalletconnectStore.setTransactionData(payload);
        if (payload.method === 'eth_sendTransaction') {
          WalletconnectStore.setStatus(WALLETCONNECT_STATUS.SEND_TRANSACTION);
        } else if (payload.method === 'eth_sign') {
          WalletconnectStore.setStatus(WALLETCONNECT_STATUS.SIGN_TRANSACTION);
        } else if (payload.method === 'personal_sign') {
          WalletconnectStore.setStatus(
            WALLETCONNECT_STATUS.SIGN_PERSONAL_MESSAGE,
          );
        } else if (payload.method && payload.method === 'eth_signTypedData') {
          WalletconnectStore.setStatus(WALLETCONNECT_STATUS.SIGN_TYPED_DATA);
        }
      }
    });
    this.walletConnector.on('disconnect', error => {
      if (error) {
        throw error;
      }
      this.walletConnector = null;
      this.onDisconnect();
    });

    this.walletConnector.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }
    });
    return true;
  }
}

let service = new WalletConnectService();
export {service as WalletConnectService};
