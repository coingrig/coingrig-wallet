import {action, makeAutoObservable} from 'mobx';
import {WALLETCONNECT_STATUS} from 'services/walletconnect';

class walletconnectStore {
  peerMeta: any;
  chainId: any;
  status: string;
  transactionData: any;

  constructor() {
    this.peerMeta = null;
    this.chainId = null;
    this.status = WALLETCONNECT_STATUS.DISCONNECTED;
    makeAutoObservable(this);
  }

  setPeerMeta = action((value: any) => {
    this.peerMeta = value;
  });

  setChainId = action((value: any) => {
    this.chainId = value;
  });

  setStatus = action((value: string) => {
    this.status = value;
  });

  setTransactionData = action((value: any) => {
    this.transactionData = value;
  });
}

export const WalletconnectStore: walletconnectStore = new walletconnectStore();
