import {IWalletConfig} from '@coingrig/core';
import {WalletStore} from '../../stores/wallet';

const BSC_DESCRIPTOR: IWalletConfig = {
  symbol: 'BNB',
  name: 'Binance Coin',
  chain: 'BSC',
  type: 'coin',
  decimals: 18,
  contract: null,
  walletAddress: null,
  privKey: null,
};

const POLYGON_DESCRIPTOR: IWalletConfig = {
  symbol: 'MATIC',
  name: 'MATIC',
  chain: 'POLYGON',
  type: 'coin',
  decimals: 18,
  contract: null,
  walletAddress: null,
  privKey: null,
};

export class Migration {
  migrationRequired = async (installedMigration): Promise<boolean> => {
    // If the app is already new, don't bother checking
    if (installedMigration > 26) {
      return false;
    }
    // Check if wallets are setup for the current new native tokens
    let wallets = WalletStore.wallets;
    if (wallets.length > 0) {
      return (
        !WalletStore.getWalletAddressByChain(BSC_DESCRIPTOR.chain) ||
        !WalletStore.getWalletAddressByChain(POLYGON_DESCRIPTOR.chain) ||
        !WalletStore.getWalletByCoinId(
          BSC_DESCRIPTOR.symbol,
          BSC_DESCRIPTOR.chain,
        ) ||
        !WalletStore.getWalletByCoinId(
          POLYGON_DESCRIPTOR.symbol,
          POLYGON_DESCRIPTOR.chain,
        )
      );
    }
    return false;
  };

  migrationHandler = async () => {
    let wallets = WalletStore.wallets;
    // Assign the new chain private keys
    let ethWalletAddress = WalletStore.getWalletAddressByChain('ETH')!;
    if (!WalletStore.getWalletAddressByChain(BSC_DESCRIPTOR.chain)) {
      WalletStore.addWalletAddress({
        walletAddress: ethWalletAddress,
        chain: BSC_DESCRIPTOR.chain,
      });
    }
    if (!WalletStore.getWalletAddressByChain(POLYGON_DESCRIPTOR.chain)) {
      WalletStore.addWalletAddress({
        walletAddress: ethWalletAddress,
        chain: POLYGON_DESCRIPTOR.chain,
      });
    }
    // Create the new wallets
    if (
      !WalletStore.getWalletByCoinId(
        BSC_DESCRIPTOR.symbol,
        BSC_DESCRIPTOR.chain,
      )
    ) {
      // BTC and ETH are already in pos 0 and 1
      wallets.splice(2, 0, {
        symbol: BSC_DESCRIPTOR.symbol.toUpperCase(),
        name: BSC_DESCRIPTOR.name,
        cid: 'binancecoin',
        chain: BSC_DESCRIPTOR.chain,
        type: 'coin',
        decimals: BSC_DESCRIPTOR.decimals,
        contract: null,
        privKey: null,
        balance: 0,
        unconfirmedBalance: 0,
        value: 0,
        price: 0,
        active: true,
        image:
          'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
        walletAddress: null,
        version: 1,
      });
    }
    if (
      !WalletStore.getWalletByCoinId(
        POLYGON_DESCRIPTOR.symbol,
        POLYGON_DESCRIPTOR.chain,
      )
    ) {
      // BTC, ETH and BSC are already in pos 0, 1 and 2
      wallets.splice(3, 0, {
        symbol: POLYGON_DESCRIPTOR.symbol.toUpperCase(),
        name: POLYGON_DESCRIPTOR.name,
        cid: 'matic-network',
        chain: POLYGON_DESCRIPTOR.chain,
        type: 'coin',
        decimals: POLYGON_DESCRIPTOR.decimals,
        contract: null,
        privKey: null,
        balance: 0,
        unconfirmedBalance: 0,
        value: 0,
        price: 0,
        active: true,
        image:
          'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
        walletAddress: null,
        version: 1,
      });
    }
    WalletStore.setWallets(wallets);
    return true;
  };
}
