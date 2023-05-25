import axios from 'axios';
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

  nftList: any;

  setChainPrivateKeys = async keys => {
    return StorageSetItem(STORED_CHAIN_KEYS, JSON.stringify(keys), true);
  };

  getChainPrivateKeys = async () => {
    const storedKeys: any = await StorageGetItem(STORED_CHAIN_KEYS, true);
    if (!storedKeys) {
      return {};
    }

    return JSON.parse(storedKeys);
  };

  getNFTs = async () => {
    // if (this.nftList && this.nftList.length > 0) {
    //   return this.nftList;
    // }
    let ETHAddress;
    if (CONFIG.testNFTs) {
      ETHAddress = CONFIG.testNFTs;
    } else {
      ETHAddress = WalletStore.getWalletAddressByChain('ETH');
    }
    const url =
      endpoints.opensea + '/assets?format=json&limit=50&owner=' + ETHAddress;
    const config: any = {
      method: 'get',
      url: url,
      headers: {
        'X-API-KEY': CONFIG.OPENSEA_KEY,
      },
    };
    Logs.info('Fetching NFTs from', url);
    try {
      const response = await axios(config);
      this.nftList = response.data.assets || [];
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
      case 'POLYGON' || 'MATIC':
        return endpoints.polygon + 'tx/' + tx;
      default:
        break;
    }
  };

  getWeb3Client = async chain => {
    // Get the coresponding wallet for the chain
    const chainType = chain;
    // Get the coin descriptor for the chain native asset
    const cryptoWalletDescriptor = WalletStore.getWalletByCoinId(
      this.getChainNativeAsset(chainType),
      chainType,
    );
    const chainAddress = WalletStore.getWalletAddressByChain(chainType);
    // Get the chain private key for signature
    const chainKeys = await this.getChainPrivateKeys();
    // Build the crypto wallet to send the transaction with
    const cryptoWallet = WalletFactory.getWallet(
      Object.assign({}, cryptoWalletDescriptor, {
        walletAddress: chainAddress,
        privKey: chainKeys.ETH,
      }),
    );
    const signingManager = cryptoWallet.getSigningManager();
    const w3client = signingManager?.client;
    if (!w3client) {
      return;
    }
    return w3client;
  };

  getAccountBalance = async () => {
    try {
      if (MarketStore.coins.length <= 10) {
        const coins = await MarketStore.getTopCoins(COINS_MIN);
        if (!coins) {
          return false;
        }
      }
      const now = Date.now();
      if (now - this.lastFetchedBalance! < CONFIG.BALANCE_TIMEOUT * 1000) {
        return true;
      }
      this.lastFetchedBalance = now;
      Logs.info('Refreshing general balance');
      const coninIds = WalletStore.getCoinCIDList() || [];
      const tokenBalances = await this.getBulkTokenBalance(
        WalletStore.walletAddresses,
      );
      //@ts-ignore
      const prices = await MarketStore.getCoinsByList(coninIds);
      const chainKeys = await this.getChainPrivateKeys();
      for (let i = 0; i < WalletStore.wallets.length; i++) {
        const chain = WalletStore.wallets[i].chain;
        if (chain.startsWith('cg_')) {
          const w = WalletStore.wallets[i];
          let np = prices[w.cid!.toLowerCase()]?.usd ?? null;
          np = parseFloat(np);
          WalletStore.setPrice(w.symbol, w.chain, np);
          continue;
        }
        const contract = WalletStore.wallets[i].contract?.toLowerCase() ?? null;
        const wallet = Object.assign({}, WalletStore.wallets[i], {
          privKey: chainKeys[chain],
          walletAddress: WalletStore.getWalletAddressByChain(chain),
        });
        //
        const cryptoWallet = WalletFactory.getWallet(wallet);
        // Check if it's a token
        const token = tokenBalances.find(o => o.contract === contract);
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
          const cidExists = wallet.cid ?? null;
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

  // getCexBalance = async () => {
  //   try {
  //     await CexService.getAllBalances();
  //   } catch (error) {
  //     // what happen if user delete the keys after a while ?
  //     Logs.error(error);
  //   }
  // };

  getCoinDetails = symbol => {
    const config: any = {
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
    const requests: Promise<any>[] = [];
    for (let index = 0; index < walletAddresses.length; index++) {
      const item = walletAddresses[index];
      if (!this.CHAIN_ID_MAP[item.chain]) {
        continue;
      }
      const url = `${endpoints.covalent}/${
        this.CHAIN_ID_MAP[item.chain]
      }/address/${item.walletAddress}/balances_v2/?key=${CONFIG.COVALENT_KEY}`;
      Logs.info(url);
      const config: any = {
        method: 'get',
        url: url,
        timeout: 2000,
      };

      requests.push(axios(config));
    }
    const tokens: any[] = [];
    try {
      const results = await Promise.all(requests);
      for (let index = 0; index < results.length; index++) {
        const result = results[index];
        const chainId = result.data.data.chain_id;
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

  prepareNewWallet = async (data, chain, contract, external) => {
    const wallet: IWallet = {
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      cid: data.id || data.symbol.toUpperCase(),
      chain: external ? 'cg_' + Date.now() : chain,
      type: external ? 'external' : 'token',
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
    if (!external) {
      const chainAddress = WalletStore.getWalletAddressByChain(wallet.chain);
      const cryptoWallet = WalletFactory.getWallet(
        Object.assign({}, wallet, {walletAddress: chainAddress}),
      );
      const decimals = await cryptoWallet.getDecimals();
      // Adjust the wallet settings with decimals to prevent
      // requesting again the decimals when getting the balance
      cryptoWallet.config.decimals = decimals;
      const balance = await cryptoWallet.getBalance();
      wallet.decimals = decimals;
      wallet.balance = balance.confirmedBalance;
      wallet.unconfirmedBalance = balance.unconfirmedBalance;
      if (wallet.balance > 0) {
        wallet.value = Number(
          new BigNumber(wallet.balance).multipliedBy(wallet.price),
        );
      }
    }
    WalletStore.addWallet(wallet);
    this.getAccountBalance();
  };

  updateWalletBalance = async (coin, chain) => {
    Logs.info('Get ' + coin + ' balance');
    const wallet = WalletStore.getWalletByCoinId(coin, chain);
    if (wallet?.type === 'external') {
      return true;
    }
    const chainAddress = WalletStore.getWalletAddressByChain(wallet!.chain);
    const cryptoWallet = WalletFactory.getWallet(
      Object.assign({}, wallet, {walletAddress: chainAddress}),
    );
    const balance = await cryptoWallet.getBalance();
    WalletStore.setBalance(coin, chain, balance.getValue());
    WalletStore.setUnconfirmedBalance(
      coin,
      chain,
      balance.getUnconfirmedBalance(),
    );
    return true;
  };

  prepareCustomToken = async (chain, contract, image) => {
    const wallet: any = {
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
    const chainAddress = WalletStore.getWalletAddressByChain(wallet.chain);
    const cryptoWallet = WalletFactory.getWallet(
      Object.assign({}, wallet, {walletAddress: chainAddress}),
    );
    const decimals = await cryptoWallet.getDecimals();
    // Adjust the wallet settings with decimals to prevent
    // requesting again the decimals when getting the balance
    cryptoWallet.config.decimals = decimals;
    const balance = await cryptoWallet.getBalance();
    const symbol = await cryptoWallet.getCurrencySymbol();
    const name = await cryptoWallet.getCurrencyName();
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

  getChainHistory = async (startTime, userAddress, chain) => {
    const config: any = {
      method: 'get',
      url:
        'https://api.debank.com/history/list?page_count=100&start_time=' +
        startTime +
        '&token_id=&user_addr=' +
        userAddress +
        '&chain=' +
        chain,
    };
    return axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        Logs.error(error);
        return error;
      });
  };
  getReferralHistory = async (startTime, userAddress) => {
    const config: any = {
      method: 'get',
      url:
        'https://api.debank.com/history/list?page_count=100&start_time=' +
        startTime +
        '&token_id=&user_addr=' +
        userAddress,
    };
    return axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        Logs.error(error);
        return error;
      });
  };
}

const service = new CryptoService();
export {service as CryptoService};
