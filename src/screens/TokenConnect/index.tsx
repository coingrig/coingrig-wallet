import React, {useEffect} from 'react';
import {View, Text, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {styles} from './styles';
import TokenPreview from 'components/widgets/TokenPreview';
import {Colors} from 'utils/colors';
import {useTranslation} from 'react-i18next';
import {BigButton} from 'components/bigButton';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {Logs} from 'services/logs';
import CONFIG from 'config';
const coins = require('../../assets/tokens.json');

export default function TokenConnectScreen({route}) {
  const {t} = useTranslation();
  const [inProgress, setInProgress] = React.useState<boolean>(true);
  const [chainSupported, setChainSupported] = React.useState<boolean>(true);
  const [previewWalletFrom, setPreviewWalletFrom] = React.useState<any>(null);
  const [previewWalletTo, setPreviewWalletTo] = React.useState<any>(null);

  useEffect(() => {
    // route.params = {
    //   chain: 'polygon',
    //   from: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    //   to: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    // };
    if (route.params) {
      Logs.info('TokenConnectScreen', route.params);
      // USDT / USDC
      // coingrig://swap/polygon/0xc2132d05d31c914a87c6611c10748aeb04b58e8f/0x2791bca1f2de4661ed88a30c99a7a9449aa84174
      autoTokenData();
    } else {
      setInProgress(false);
      setChainSupported(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToken = async () => {
    setInProgress(true);
    if (previewWalletFrom !== null) {
      WalletStore.addWallet(previewWalletFrom);
    }
    if (previewWalletTo !== null) {
      WalletStore.addWallet(previewWalletTo);
    }
    showMessage({
      message: t('message.wallet.token.added'),
      type: 'success',
    });
    let chain = route.params.chain.toUpperCase();
    let fromToken = route.params.from;
    let toToken = route.params.to;
    let walletFrom = await checkTokenExists(chain, fromToken);
    let walletTo = await checkTokenExists(chain, toToken);
    CONFIG.navigation.replace('SwapScreen', {
      chain: chain,
      wallet: walletFrom,
      buyWallet: walletTo,
      slippage: route.params.slippage,
    });
    setInProgress(false);
    CryptoService.getAccountBalance();
  };

  const getDefaulTokenIcon = chain => {
    switch (chain) {
      case 'ETH':
        return 'https://etherscan.com/images/main/empty-token.png';
      case 'BSC':
        return 'https://bscscan.com/images/main/empty-token.png';
      case 'POLYGON':
        return 'https://polygonscan.com/images/main/empty-token.png';
      default:
        break;
    }
  };

  // Search for the icon in our known database
  const getTokenIcon = async symbol => {
    let s = symbol.toUpperCase();
    let coinInfo = coins.find(o => o.symbol.toUpperCase() === s);
    if (!coinInfo || !coinInfo.id) {
      return null;
    }
    try {
      let data = await CryptoService.getCoinDetails(coinInfo.id);
      if (data && data.image) {
        return data.image.large;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const checkTokenExists = async (chain, address) => {
    // Do we have a contract address
    if (address.startsWith('0x')) {
      // Check if it is already in portfolio
      return WalletStore.getWalletByCoinContract(address, chain);
    }
    // Check if address is the native asset of the chain symbol
    if (CryptoService.getChainNativeAsset(chain) === address.toUpperCase()) {
      return WalletStore.getWalletByCoinId(address.toUpperCase(), chain);
    }
    return undefined;
  };

  const autoTokenData = async () => {
    try {
      // Check that data is loaded first on a cold start
      if (!WalletStore.isHydrated) {
        await WalletStore.hydrateStore();
      }
      let chain = route.params.chain.toUpperCase();
      let fromToken = route.params.from;
      let toToken = route.params.to;
      switch (chain) {
        case 'ETH':
        case 'BSC':
        case 'POLYGON':
          break;
        default:
          setChainSupported(false);
          setInProgress(false);
          return;
      }

      let walletFrom = await checkTokenExists(chain, fromToken);
      let walletTo = await checkTokenExists(chain, toToken);

      if (walletFrom && walletTo) {
        // We have both assets already in portfolio, redirect to swap
        // CONFIG.navigation.goBack(null);
        CONFIG.navigation.replace('SwapScreen', {
          chain: chain,
          wallet: walletFrom,
          buyWallet: walletTo,
          slippage: route.params.slippage,
        });
        setInProgress(false);
        return;
      }

      if (!walletFrom) {
        walletFrom = await CryptoService.prepareCustomToken(
          chain,
          fromToken,
          getDefaulTokenIcon(chain),
        );
        if (walletFrom) {
          let icon = await getTokenIcon(walletFrom.symbol);
          if (icon) {
            walletFrom.image = icon;
          }
          setPreviewWalletFrom(walletFrom);
        }
      }
      if (!walletTo) {
        walletTo = await CryptoService.prepareCustomToken(
          chain,
          toToken,
          getDefaulTokenIcon(chain),
        );
        if (walletTo) {
          let icon = await getTokenIcon(walletTo.symbol);
          if (icon) {
            walletTo.image = icon;
          }
          setPreviewWalletTo(walletTo);
        }
      }

      setInProgress(false);
    } catch (error) {
      setInProgress(false);
      Logs.error(error);
      Alert.alert('Error', t('custom_token.network_error'), [
        {text: 'OK', onPress: () => CONFIG.navigation.goBack(null)},
      ]);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flexcontainer}>
      <View>
        {inProgress ? (
          <ActivityIndicator
            size="small"
            color={Colors.foreground}
            style={styles.activityIndicator}
          />
        ) : null}
        {!inProgress && !chainSupported ? (
          <View>
            <Text style={styles.introText}>
              {t('token_connect.error.invalid_link_configuration')}
            </Text>
          </View>
        ) : null}
        {!inProgress &&
        (previewWalletFrom !== null || previewWalletTo !== null) ? (
          <View>
            <Text style={styles.introText}>
              {t(
                previewWalletFrom && previewWalletTo
                  ? 'token_connect.swapintro_other'
                  : 'token_connect.swapintro_one',
              )}
            </Text>
            <Text style={styles.previewText}>{t('custom_token.preview')}</Text>
            {previewWalletFrom !== null ? (
              <View>
                <TokenPreview coin={previewWalletFrom} />
              </View>
            ) : null}
            {previewWalletTo !== null ? (
              <View>
                <TokenPreview coin={previewWalletTo} />
              </View>
            ) : null}
            {previewWalletFrom !== null || previewWalletTo !== null ? (
              <View>
                <Text style={styles.warning}>
                  {t('custom_token.disclaimer')}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
      <View style={styles.footerButton}>
        <BigButton
          text={t(
            previewWalletFrom && previewWalletTo
              ? 'token_connect.add_asset_other'
              : 'token_connect.add_asset_one',
          )}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          disabled={inProgress || (!previewWalletFrom && !previewWalletTo)}
          onPress={() => addToken()}
        />
      </View>
    </ScrollView>
  );
}
