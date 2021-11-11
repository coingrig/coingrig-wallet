import {WalletStore} from '../../stores/wallet';

const COIN_LIST: any[] = [
  {
    symbol: 'BTC',
    cid: 'bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  },
  {
    symbol: 'ETH',
    cid: 'ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
];

export class Migration {
  migrationRequired = async (installedMigration): Promise<boolean> => {
    if (installedMigration > 22) {
      return false;
    }
    let wallets = WalletStore.wallets;
    if (wallets.length > 0) {
      // If there is a wallet that has no version property then yes
      return wallets.find(o => !o.hasOwnProperty('version')) !== undefined;
    }
    return false;
  };

  migrationHandler = async () => {
    let wallets = WalletStore.wallets;
    let newWallets = [];
    for (let i = 0; i < wallets.length; i++) {
      try {
        const wallet = wallets[i];
        // For each wallet we need to provide:
        // cid = remote coin id on coingeko
        // image = an image url
        let newDescriptor = COIN_LIST.find(o => o.symbol === wallet.symbol);
        let cid = newDescriptor.cid;
        let image = newDescriptor.image;
        newWallets.push(
          //@ts-ignore
          Object.assign({}, wallet, {
            cid: cid,
            image: image,
            version: 1,
          }),
        );
      } catch (error) {}
    }
    WalletStore.setWallets(newWallets);
    return true;
  };
}
