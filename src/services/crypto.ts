var axios = require('axios');
import {COINS_MIN, STORED_CHAIN_KEYS} from 'utils/constants';
import {MarketStore} from 'stores/market';
import {IWallet, IWalletAddresses, WalletStore} from 'stores/wallet';
import BigNumber from 'bignumber.js';
import {Logs} from 'services/logs';
import {WalletFactory} from '@coingrig/core';
import {StorageSetItem, StorageGetItem} from './storage';
import endpoints from 'utils/endpoints';
import CONFIG from 'config';

class CryptoService {
  lastFetchedBalance = 0;
  CHAIN_ID_MAP = {
    ETH: 1,
    BSC: 56,
    POLYGON: 137,
  };
  CHAIN_ID_TYPE_MAP = {
    1: 'ETH',
    56: 'BSC',
    137: 'POLYGON',
  };

  setChainPrivateKeys = async keys => {
    return StorageSetItem(STORED_CHAIN_KEYS, JSON.stringify(keys), true);
  };

  getChainPrivateKeys = async () => {
    let storedKeys: any = await StorageGetItem(STORED_CHAIN_KEYS, true);
    if (!storedKeys) {
      return {};
    }
    return JSON.parse(storedKeys);
  };

  getNFTs = async () => {
    let ETHAddress;
    if (CONFIG.testNFTs) {
      ETHAddress = CONFIG.testNFTs;
    } else {
      ETHAddress = WalletStore.getWalletAddressByChain('ETH');
    }
    const url =
      endpoints.opensea + '/assets?format=json&limit=50&owner=' + ETHAddress;
    var config = {
      method: 'get',
      url: url,
      headers: {
        'X-API-KEY': '790d4e9223714481a11633acbda338de',
      },
    };
    Logs.info('Fetching NFTs from', url);
    try {
      const response = await axios(config);
      return response.data.assets || [];
    } catch (error) {
      Logs.error(error);
      return [];
    }
  };

  getBlockExplorer = (chain: string) => {
    switch (chain) {
      case 'BTC':
        return (
          endpoints.btc +
          'address/' +
          WalletStore.getWalletAddressByChain(chain)
        );
      case 'ETH':
        return (
          endpoints.eth +
          'address/' +
          WalletStore.getWalletAddressByChain(chain)
        );
      case 'BSC':
        return (
          endpoints.bsc +
          'address/' +
          WalletStore.getWalletAddressByChain(chain)
        );
      case 'POLYGON':
        return (
          endpoints.polygon +
          'address/' +
          WalletStore.getWalletAddressByChain(chain)
        );
      default:
        break;
    }
  };

  getTxExplorer = (chain: string, tx: string) => {
    switch (chain) {
      case 'BTC':
        return endpoints.btc + 'tx/' + tx;
      case 'ETH':
        return endpoints.eth + 'tx/' + tx;
      case 'BSC':
        return endpoints.bsc + 'tx/' + tx;
      case 'POLYGON':
        return endpoints.polygon + 'tx/' + tx;
      default:
        break;
    }
  };

  getWeb3Client = async chain => {
    // Get the coresponding wallet for the chain
    let chainType = chain;
    // Get the coin descriptor for the chain native asset
    let cryptoWalletDescriptor = WalletStore.getWalletByCoinId(
      this.getChainNativeAsset(chainType),
      chainType,
    );
    const chainAddress = WalletStore.getWalletAddressByChain(chainType);
    // Get the chain private key for signature
    let chainKeys = await this.getChainPrivateKeys();
    // Build the crypto wallet to send the transaction with
    let cryptoWallet = WalletFactory.getWallet(
      Object.assign({}, cryptoWalletDescriptor, {
        walletAddress: chainAddress,
        privKey: chainKeys.ETH,
      }),
    );
    let signingManager = cryptoWallet.getSigningManager();
    let w3client = signingManager?.client;
    if (!w3client) {
      return;
    }
    return w3client;
  };

  getAccountBalance = async () => {
    const now = Date.now();
    if (now - this.lastFetchedBalance! < CONFIG.BALANCE_TIMEOUT * 1000) {
      return true;
    }
    this.lastFetchedBalance = now;
    try {
      if (MarketStore.coins.length <= 10) {
        let coins = await MarketStore.getTopCoins(COINS_MIN);
        if (!coins) {
          return false;
        }
      }
      Logs.info('Refreshing general balance');
      const coninIds = WalletStore.getCoinCIDList() || [];
      const tokenBalances = await this.getBulkTokenBalance(
        WalletStore.walletAddresses,
      );
      //@ts-ignore
      let prices = await MarketStore.getCoinsByList(coninIds);
      let chainKeys = await this.getChainPrivateKeys();
      for (let i = 0; i < WalletStore.wallets.length; i++) {
        let chain = WalletStore.wallets[i].chain;
        let contract = WalletStore.wallets[i].contract?.toLowerCase() ?? null;
        let wallet = Object.assign({}, WalletStore.wallets[i], {
          privKey: chainKeys[chain],
          walletAddress: WalletStore.getWalletAddressByChain(chain),
        });
        //
        console.log(chain, WalletStore.getWalletAddressByChain(chain));
        let cryptoWallet = WalletFactory.getWallet(wallet);
        // Check if it's a token
        let token = tokenBalances.find(o => o.contract === contract);
        if (contract && token !== undefined) {
          Logs.info('Balance from provider', wallet.symbol);
          WalletStore.setBalance(
            wallet.symbol,
            wallet.chain,
            Number(new BigNumber(token.balance).div(10 ** token.decimals)),
          );
          WalletStore.setPrice(wallet.symbol, wallet.chain, token.rate);
          Logs.info(wallet.symbol, wallet.chain, token.rate);
          // Move to next wallet item
          // continue;
        } else {
          Logs.info('Getting balance from @core', wallet.symbol);
          // Not a token, then check regular coin balance
          // Don't update the price if none is available from the provider
          let cidExists = wallet.cid ?? null;
          let newPrice: any = '';
          if (!cidExists) {
            newPrice = 0;
          } else {
            newPrice = prices[wallet.cid!.toLowerCase()]?.usd ?? null;
          }

          if (newPrice !== null) {
            // The price can be actually 0
            newPrice = parseFloat(newPrice);
            WalletStore.setPrice(wallet.symbol, wallet.chain, newPrice);
          }
          const balance = await cryptoWallet.getBalance();
          console.log(wallet.symbol, balance, newPrice);
          const unconfirmedBalance = balance.getUnconfirmedBalance();
          WalletStore.setBalance(
            wallet.symbol,
            wallet.chain,
            balance.getValue(),
          );
          WalletStore.setUnconfirmedBalance(
            wallet.symbol,
            wallet.chain,
            unconfirmedBalance,
          );
        }
      }

      return true;
    } catch (error) {
      Logs.error(error);
      return false;
    }
  };

  getCoinDetails = symbol => {
    var config = {
      method: 'get',
      url: endpoints.coingecko + '/coins/' + symbol + '?sparkline=true',
    };
    Logs.info('Get asset data: ', config);
    return axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        Logs.error(error);
        return error;
      });
  };

  getBulkTokenBalance = async (walletAddresses: IWalletAddresses[]) => {
    let requests: Promise<any>[] = [];
    for (let index = 0; index < walletAddresses.length; index++) {
      const item = walletAddresses[index];
      if (!this.CHAIN_ID_MAP[item.chain]) {
        continue;
      }
      const url = `${endpoints.covalent}/${
        this.CHAIN_ID_MAP[item.chain]
      }/address/${item.walletAddress}/balances_v2/?key=${CONFIG.COVALENT_KEY}`;
      Logs.info(url);
      var config = {
        method: 'get',
        url: url,
        timeout: 2000,
      };

      requests.push(axios(config));
    }
    let tokens: any[] = [];
    try {
      let results = await Promise.all(requests);
      for (let index = 0; index < results.length; index++) {
        const result = results[index];
        let chainId = result.data.data.chain_id;
        result.data.data.items.forEach(token => {
          tokens.push({
            chain: this.CHAIN_ID_TYPE_MAP[chainId],
            contract: token.contract_address.toLowerCase(),
            decimals: token.contract_decimals,
            balance: token.balance,
            rate: token.quote_rate,
          });
        });
      }
    } catch (error) {
      Logs.error(error);
    }
    Logs.info('Refreshed bulk tokens');
    return tokens;
  };

  getSupportedChainbyName = name => {
    switch (name) {
      case 'ethereum':
        return 'ETH';
      case 'binance-smart-chain':
        return 'BSC';
      case 'polygon-pos':
        return 'POLYGON';
      default:
        return '';
    }
  };

  getSupportedChainNamebyID = id => {
    switch (id) {
      case 'ETH':
        return 'Ethereum';
      case 'binance-smart-chain':
      case 'BSC':
        return 'Binance Smart Chain';
      case 'polygon-pos':
      case 'POLYGON':
        return 'Polygon';
      case 'BTC':
        return 'Bitcoin';
      default:
        return '';
    }
  };

  getChainNativeAsset = chain => {
    switch (chain) {
      case 'ETH':
        return 'ETH';
      case 'BSC':
        return 'BNB';
      case 'POLYGON':
        return 'MATIC';
      case 'BTC':
        return 'BTC';
      default:
        return '';
    }
  };

  prepareNewWallet = async (data, chain, contract) => {
    let wallet: IWallet = {
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      cid: data.id || data.symbol.toUpperCase(),
      chain: chain,
      type: 'token',
      decimals: null,
      contract: contract || null,
      privKey: null,
      balance: 0,
      unconfirmedBalance: 0,
      value: 0,
      price: data.market_data?.current_price?.usd ?? 0,
      active: true,
      image: data.image?.large || null,
      walletAddress: null,
      version: CONFIG.NEW_ASSET_DESCRIPTOR_VERSION,
    };
    let chainAddress = WalletStore.getWalletAddressByChain(wallet.chain);
    let cryptoWallet = WalletFactory.getWallet(
      Object.assign({}, wallet, {walletAddress: chainAddress}),
    );
    let decimals = await cryptoWallet.getDecimals();
    // Adjust the wallet settings with decimals to prevent
    // requesting again the decimals when getting the balance
    cryptoWallet.config.decimals = decimals;
    let balance = await cryptoWallet.getBalance();
    wallet.decimals = decimals;
    wallet.balance = balance.confirmedBalance;
    wallet.unconfirmedBalance = balance.unconfirmedBalance;
    if (wallet.balance > 0) {
      wallet.value = Number(
        new BigNumber(wallet.balance).multipliedBy(wallet.price),
      );
    }
    WalletStore.addWallet(wallet);
  };

  updateWalletBalance = async (coin, chain) => {
    Logs.info('Get ' + coin + ' balance');
    const wallet = WalletStore.getWalletByCoinId(coin, chain);
    let chainAddress = WalletStore.getWalletAddressByChain(wallet!.chain);
    let cryptoWallet = WalletFactory.getWallet(
      Object.assign({}, wallet, {walletAddress: chainAddress}),
    );
    let balance = await cryptoWallet.getBalance();
    WalletStore.setBalance(coin, chain, balance.getValue());
    WalletStore.setUnconfirmedBalance(
      coin,
      chain,
      balance.getUnconfirmedBalance(),
    );
    return true;
  };

  prepareCustomToken = async (chain, contract, image) => {
    let wallet: any = {
      symbol: null,
      name: null,
      cid: null,
      chain: chain,
      type: 'custom-token',
      decimals: null,
      contract: contract,
      privKey: null,
      balance: 0,
      unconfirmedBalance: 0,
      value: 0,
      price: 0,
      active: true,
      image: image,
      walletAddress: null,
      version: CONFIG.NEW_ASSET_DESCRIPTOR_VERSION,
    };
    let chainAddress = WalletStore.getWalletAddressByChain(wallet.chain);
    let cryptoWallet = WalletFactory.getWallet(
      Object.assign({}, wallet, {walletAddress: chainAddress}),
    );
    let decimals = await cryptoWallet.getDecimals();
    // Adjust the wallet settings with decimals to prevent
    // requesting again the decimals when getting the balance
    cryptoWallet.config.decimals = decimals;
    let balance = await cryptoWallet.getBalance();
    let symbol = await cryptoWallet.getCurrencySymbol();
    let name = await cryptoWallet.getCurrencyName();
    wallet.symbol = symbol;
    wallet.name = name;
    wallet.decimals = decimals;
    wallet.cid = contract;
    wallet.balance = balance.confirmedBalance;
    wallet.unconfirmedBalance = balance.unconfirmedBalance;
    if (wallet.balance > 0) {
      wallet.value = Number(
        new BigNumber(wallet.balance).multipliedBy(wallet.price),
      );
    }
    return wallet;
  };
}

let service = new CryptoService();
export {service as CryptoService};
