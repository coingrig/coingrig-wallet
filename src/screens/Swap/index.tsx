/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import {Colors} from 'utils/colors';
import {styles} from './style';
import {Segment, SegmentedControl} from 'react-native-resegmented-control';
import Dialog from 'react-native-dialog';
import {showMessage} from 'react-native-flash-message';
import SwapService from 'services/swap';
import {useTranslation} from 'react-i18next';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {BigButton} from 'components/bigButton';
import SwapCoin from 'components/SwapCoin';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {
  calcFee,
  formatFee,
  formatNoComma,
  openLink,
  sleep,
  toEth,
  toWei,
} from 'utils';
import endpoints from 'utils/endpoints';
import {LoadingModal} from 'services/loading';
import {Logs} from 'services/logs';
import {useTransitionEnd} from 'utils/hooks/useTransitionEnd';
import BigNumber from 'bignumber.js';
import CONFIG from 'config';
import {ILogEvents, LogEvents} from 'utils/analytics';
import {ConfigStore} from 'stores/config';

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

let timer: any = null;

const SwapScreen = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  let defaultSlippage = 0.5;
  if (props.route.params && props.route.params.slippage) {
    defaultSlippage = props.route.params.slippage;
  }
  defaultSlippage = defaultSlippage / 100;
  if (isNaN(defaultSlippage)) {
    defaultSlippage = 0.005;
  }
  const [swapChain, setSwapChain] = useState(
    props.route.params ? props.route.params.wallet.chain : 'ETH',
  );
  const transitionEnded = useTransitionEnd(navigation);
  const [status, setStatus] = useState('preview');
  const [slippage, setSlippage] = useState(defaultSlippage); // default 0.005
  const [slippageText, setSlippageText] = useState(defaultSlippage * 100); // default 0.5
  const [showSlippage, setShowSlippage] = useState(false);
  const [sellTokenSymbol, setSellTokenSymbol] = useState('');
  const [sellToken, setSellToken] = useState('');
  const [sellTokenLogo, setSellTokenLogo] = useState('');
  const [sellAmmount, setSellAmount] = useState('');
  const [buyTokenSymbol, setBuyTokenSymbol] = useState('');
  const [buyToken, setBuyToken] = useState('MATIC');
  const [buyTokenLogo, setBuyTokenLogo] = useState('');
  const [buyAmmount, setBuyAmount] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [allowanceAction, setAllowanceAction] = useState(null);
  const [allowanceFee, setAllowanceFee] = useState(null);
  const [chainAddress, setChainAddress] = useState<any>(null);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);

  useEffect(() => {
    //@ts-ignore
    setChainAddress(WalletStore.getWalletAddressByChain(swapChain));
    if (!props.route.params) {
      resetSwap('ETH', 'ETH');
    }
    //TODO Change to keyboardListener hook
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardEnabled(true);
    });
    const willShowSubscription = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardEnabled(true);
      },
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardEnabled(false);
    });

    LogEvents(ILogEvents.SCREEN, 'Swap');

    return () => {
      showSubscription.remove();
      willShowSubscription.remove();
      hideSubscription.remove();
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (transitionEnded) {
      if (props.route.params && props.route.params.wallet) {
        const wallet = props.route.params.wallet;
        const buyWallet = props.route.params.buyWallet;
        setStatus('preview');
        setQuote(null);
        setSellToken(wallet.contract ?? wallet.symbol);
        setSellTokenSymbol(wallet.symbol);
        setSellTokenLogo(wallet.image);
        if (buyWallet) {
          setBuyToken(buyWallet.contract ?? buyWallet.symbol);
          setBuyTokenSymbol(buyWallet.symbol);
          setBuyTokenLogo(buyWallet.image);
        } else {
          setBuyToken('-');
          setBuyTokenSymbol(t('swap.select'));
          setBuyTokenLogo(endpoints.assets + '/images/plus.png');
        }
        setBuyAmount('');
      }
      CryptoService.getAccountBalance();
    }
  }, [transitionEnded]);

  const reverse = () => {
    let temp: any = {};
    temp.buyToken = buyToken;
    temp.buyTokenSymbol = buyTokenSymbol;
    temp.buyTokenLogo = buyTokenLogo;
    temp.sellToken = sellToken;
    temp.sellTokenSymbol = sellTokenSymbol;
    temp.sellTokenLogo = sellTokenLogo;

    setStatus('preview');
    setQuote(null);
    setSellToken(temp.buyToken);
    setSellTokenSymbol(temp.buyTokenSymbol);
    setSellTokenLogo(temp.buyTokenLogo);
    setBuyToken(temp.sellToken);
    setBuyTokenSymbol(temp.sellTokenSymbol);
    setBuyTokenLogo(temp.sellTokenLogo);
    temp = null;
  };

  const fetchQuote = async (
    _buyToken,
    _sellToken,
    _sellAmount,
    exact = false,
  ) => {
    const params: any = {
      buyToken: _buyToken,
      sellToken: _sellToken,
      sellAmount: _sellAmount,
      slippagePercentage: slippage,
    };
    if (exact === true) {
      params.takerAddress = chainAddress;
      if (CONFIG.SWAP_FEE !== 0) {
        params.buyTokenPercentageFee = CONFIG.SWAP_FEE;
        params.feeRecipient = ConfigStore.feeAddress;
      }
      if (CONFIG.AFFILIATE_ADDRESS) {
        params.affiliateAddress = CONFIG.AFFILIATE_ADDRESS;
      }
    }
    try {
      return await SwapService.getQuote(swapChain, params);
    } catch (e) {
      return null;
    }
  };

  const checkPreview = async forApprove => {
    if (!forApprove) {
      Keyboard.dismiss();
      await sleep(500);
      LoadingModal.instance.current?.show();
    }
    if (
      !buyToken ||
      (!sellToken && (Number(buyAmmount) > 0 || Number(sellAmmount) > 0))
    ) {
      LoadingModal.instance.current?.hide();
      return;
    }
    const sellWallet = WalletStore.getWalletByCoinId(
      sellTokenSymbol,
      swapChain,
    );
    const buyWallet = WalletStore.getWalletByCoinId(buyTokenSymbol, swapChain);
    const sellAmount = toWei(
      formatNoComma(sellAmmount),
      sellWallet?.decimals,
    ).toString();
    try {
      if (!forApprove) {
        const success = await fetchQuote(
          buyToken,
          sellToken,
          sellAmount,
          false,
        );
        if (!success) {
          LoadingModal.instance.current?.hide();
          showMessage({
            message: t('swap.error.swap_not_found'),
            type: 'warning',
          });
          setStatus('preview');
          return;
        }
        setQuote(success);
        setBuyAmount(toEth(success.buyAmount, buyWallet?.decimals).toString());
        setSellAmount(
          toEth(success.sellAmount, sellWallet?.decimals).toString(),
        );
        // Does the user have enough cash in his wallet to start the sell?
        //@ts-ignore
        if (Number(sellWallet?.balance) < Number(sellAmmount)) {
          LoadingModal.instance.current?.hide();
          showMessage({
            message: t('swap.error.not_enough_balance'),
            type: 'warning',
          });
          setStatus('preview');
          return;
        }
        startSwap(success);
      } else {
        startSwap(quote);
      }
    } catch (e) {
      Logs.error(e);
      LoadingModal.instance.current?.hide();
      showMessage({
        message: e ?? t('swap.error.swap_not_found'),
        type: 'warning',
      });
      setStatus('preview');
    }
  };

  const resetSwap = (defaultCoin, chain) => {
    setSellToken(defaultCoin);
    setSellTokenSymbol(defaultCoin);
    setSellAmount('');
    const logo = WalletStore.getWalletByCoinId(defaultCoin, chain)?.image;
    setSellTokenLogo(logo || '');
    setBuyToken('-');
    setBuyTokenSymbol(t('swap.select'));
    setBuyAmount('');
    setBuyTokenLogo(endpoints.assets + '/images/plus.png');
  };

  const changeChain = newChain => {
    setSwapChain(newChain);
    setStatus('preview');
    setQuote(null);
    switch (newChain) {
      case 'ETH':
        resetSwap('ETH', 'ETH');
        break;
      case 'BSC':
        resetSwap('BNB', 'BSC');
        break;
      case 'POLYGON':
        resetSwap('MATIC', 'POLYGON');
        break;
      default:
        break;
    }
  };

  const resetToPreview = () => {
    setStatus('preview');
  };

  const startSwap = async quoteInfo => {
    if (
      quoteInfo.allowanceTarget !== '0x0000000000000000000000000000000000000000'
    ) {
      // Trading an ERC20 token, an allowance must be first set!
      Logs.info('Checking allowance');
      // Check if the contract has sufficient allowance
      const w3client = await CryptoService.getWeb3Client(swapChain);
      if (!w3client) {
        LoadingModal.instance.current?.hide();
        showMessage({
          message: t('swap.error.swap_chain_not_supported'),
          type: 'warning',
        });
        setStatus('preview');
        return;
      }
      const contract = new w3client!.eth.Contract(
        ERC20_ABI,
        quoteInfo.sellTokenAddress,
      );
      quoteInfo.from = chainAddress;
      const spendingAllowance = await contract.methods
        .allowance(quoteInfo.from, quoteInfo.allowanceTarget)
        .call();
      // Are we already allowed to sell the amount we desire?
      if (
        new BigNumber(spendingAllowance).isLessThan(
          new BigNumber(quoteInfo.sellAmount),
        )
      ) {
        Logs.info(
          'Approval required',
          `${spendingAllowance} < ${quoteInfo.sellAmount}`,
        );
        prepareApproval(contract, quoteInfo);
        // swapAllowanceContainer.current?.setModalVisible();
        setStatus('approve');
        LoadingModal.instance.current?.hide();
        return;
      } else {
        Logs.info('Allowance is sufficient');
        setAllowanceFee(null);
      }
    } else {
      Logs.info('Allowance is not required');
    }
    // Get the exact quote now that allowance is OK and let the user send the transaction
    try {
      const sellWallet = WalletStore.getWalletByCoinId(
        sellTokenSymbol,
        swapChain,
      );
      // Does the user have enough cash in his wallet to start the sell?
      //@ts-ignore
      if (Number(sellWallet?.balance) < Number(sellAmmount)) {
        LoadingModal.instance.current?.hide();
        showMessage({
          message: t('swap.error.not_enough_balance'),
          type: 'warning',
        });
        setStatus('preview');
        return;
      }
      const buyWallet = WalletStore.getWalletByCoinId(
        buyTokenSymbol,
        swapChain,
      );
      const sellAmount = toWei(
        formatNoComma(sellAmmount),
        sellWallet?.decimals,
      ).toString();

      const success = await fetchQuote(buyToken, sellToken, sellAmount, true);
      if (!success) {
        LoadingModal.instance.current?.hide();
        showMessage({
          message: t('swap.error.swap_not_found'),
          type: 'warning',
        });
        setStatus('preview');
        return;
      }
      setQuote(success);
      setBuyAmount(toEth(success.buyAmount, buyWallet?.decimals).toString());
      setSellAmount(toEth(success.sellAmount, sellWallet?.decimals).toString());
      // swapContainer.current?.setModalVisible();
      setStatus('swap');
      LoadingModal.instance.current?.hide();
    } catch (e) {
      Logs.error(e);
      LoadingModal.instance.current?.hide();
      showMessage({
        message: e ?? t('swap.error.swap_not_found'),
        type: 'warning',
      });
      setStatus('preview');
    }
  };

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const alertTimer = () => {
    // isSwap or approve
    Alert.alert(
      t('swap.network_congestion_title'),
      t('swap.network_congestion_message'),
      [
        {
          text: t('settings.cancel'),
          onPress: () => {
            timer = setTimeout(() => {
              alertTimer();
            }, 30000);
          },
          style: 'cancel',
        },
        {
          text: t('settings.yes'),
          onPress: async () => {
            LoadingModal.instance.current?.hide();
            navigation.goBack();
          },
        },
      ],
    );
  };

  const executeAllowance = async () => {
    Logs.info('executeAllowance');
    LoadingModal.instance.current?.show();
    try {
      let tx = null;
      timer = setTimeout(() => {
        alertTimer();
      }, 30000);
      // Send the pre-set allowance action to the chain
      //@ts-ignore
      tx = await allowanceAction.send({
        from: chainAddress,
        gas: allowanceFee,
        gasPrice: quote.gasPrice,
      });
      clearTimer();
      Logs.info('allowance', tx);
      showMessage({
        message: t('swap.message.swap_approved'),
        type: 'success',
      });
      // swapAllowanceContainer.current?.setModalVisible(false);
      // Check again after approval if swap can be edxecuted
      sleep(1500);
      checkPreview(true);
    } catch (ex) {
      LoadingModal.instance.current?.hide();
      clearTimer();
      Logs.info(ex);
      showMessage({
        message: t('swap.error.not_enough_balance'),
        type: 'warning',
      });
    } finally {
      // swapAllowanceContainer.current?.setModalVisible(false);
    }
  };

  const executeSwap = async () => {
    LoadingModal.instance.current?.show();
    try {
      const w3client = await CryptoService.getWeb3Client(swapChain);
      if (!w3client) {
        showMessage({
          message: t('swap.error.swap_chain_not_supported'),
          type: 'warning',
        });
      }
      let tx: any = null;
      timer = setTimeout(() => {
        alertTimer();
      }, 30000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tx = await w3client!.eth.sendTransaction({
        from: chainAddress,
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gasPrice: quote.gasPrice,
        gas: quote.gas,
      });
      // Logs.info(tx);
      clearTimer();
      showMessage({
        message: t('swap.message.swap_executed'),
        type: 'success',
      });
      const refFee =
        (Number(sellAmmount) * quote.price * CONFIG.SWAP_FEE).toFixed(5) ?? 0;
      ConfigStore.updateFee(refFee);

      navigation.goBack();
    } catch (ex) {
      Logs.error(ex);
      clearTimer();
      showMessage({
        message: t('swap.error.swap_failed'),
        type: 'warning',
      });
    } finally {
      // swapContainer.current?.setModalVisible(false);
      LoadingModal.instance.current?.hide();
      setStatus('preview');
      CryptoService.getAccountBalance();
      LogEvents(ILogEvents.ACTION, 'Swap');
    }
  };

  const prepareApproval = async (contract, quoteDetails) => {
    const action = await contract.methods.approve(
      quoteDetails.allowanceTarget,
      quoteDetails.sellAmount,
    );
    setAllowanceAction(action);
    const gasEstimate = await action.estimateGas();
    setAllowanceFee(gasEstimate);
  };

  const humanNumber = (isFee, gas, gasPrice) => {
    if (!isFee) {
      const wallet = WalletStore.getWalletByCoinId(sellTokenSymbol, swapChain);
      const decimals = wallet?.decimals;
      return toEth(quote.sellAmount, decimals);
    } else {
      const chainNativeAsset = CryptoService.getChainNativeAsset(swapChain);
      const wallet = WalletStore.getWalletByCoinId(chainNativeAsset, swapChain);
      const decimals = wallet?.decimals;
      const fee = calcFee(gas, gasPrice);
      const finalFee = toEth(fee, decimals);
      const dollarFee = calcFee(finalFee, wallet!.price);
      return formatFee(dollarFee);
    }
  };
  const renderItem = (item, from) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (from) {
            setSellToken(item.contract ?? item.symbol);
            setSellTokenSymbol(item.symbol);
            setSellTokenLogo(item.image);
            setShowFrom(false);
          } else {
            setBuyToken(item.contract ?? item.symbol);
            setBuyTokenSymbol(item.symbol);
            setBuyTokenLogo(item.image);
            setShowTo(false);
          }
          setBuyAmount('');
          setQuote(null);
          setStatus('preview');
        }}
        style={styles.listItem}>
        <FastImage
          style={styles.listImg}
          source={{
            uri: item.image,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <View style={styles.listContainer}>
          <Text style={styles.listName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.listBalance} numberOfLines={1}>
            {item.balance}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetails = () => {
    return (
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={{color: Colors.lighter}}>
            {t('coindetails.price')} 1 {sellTokenSymbol}
          </Text>
          <Text style={{color: Colors.foreground}}>
            {quote ? quote.price + ' ' + buyTokenSymbol : '-'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={{color: Colors.lighter}}>{t('swap.slippage')}</Text>
          <Text style={{color: Colors.foreground}}>{slippage * 100}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={{color: Colors.lighter}}>{t('swap.estimated_gas')}</Text>
          <Text style={{color: Colors.foreground}}>
            {' '}
            {quote
              ? humanNumber(true, allowanceFee || quote.gas, quote.gasPrice)
              : '-'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.detailItem}
          onPress={() =>
            openLink('https://docs.coingrig.com/other/coingrig-fees')
          }>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="information-circle-outline"
              size={17}
              color={Colors.lighter}
            />
            <Text style={{color: Colors.lighter, marginLeft: 5}}>
              {t('swap.coingrig_fee')}
            </Text>
          </View>
          <Text style={{color: Colors.foreground}}>
            {status === 'swap' ? CONFIG.SWAP_FEE * 100 + '%' : '-'}
          </Text>
        </TouchableOpacity>
        <View style={styles.detailItem}>
          <Text style={{color: Colors.lighter}}>{t('swap.allowance')}</Text>
          <Text style={{color: Colors.foreground}}>
            {t('swap.exact_amount')}
          </Text>
        </View>
      </View>
    );
  };

  const CoinsList = from => {
    return (
      <View style={styles.coinsSheet}>
        <View style={styles.list}>
          <TouchableOpacity
            onPress={() => {
              setShowFrom(false);
              setShowTo(false);
            }}
            style={styles.close}>
            <Icon name="arrow-back" size={30} color={Colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.listTitle}>
            {from ? t('swap.convert_from') : t('swap.convert_to')}
          </Text>
        </View>
        <FlatList
          data={WalletStore.wallets.filter(el => el.chain === swapChain)}
          renderItem={data => renderItem(data.item, from)}
          keyExtractor={(item: any) => item.image + item.name ?? ''}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            return (
              <Text style={styles.listFooter}>{t('swap.convert_footer')}</Text>
            );
          }}
          style={{paddingHorizontal: 20}}
        />
      </View>
    );
  };

  const renderAction = () => {
    if (status === 'preview') {
      return (
        <BigButton
          text={t('swap.preview')}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          disabled={
            sellAmmount && buyTokenSymbol !== t('swap.select') ? false : true
          }
          onPress={() => checkPreview(false)}
        />
      );
    } else if (status === 'approve') {
      return (
        <BigButton
          text={t('swap.approve')}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          disabled={false}
          onPress={() => executeAllowance()}
        />
      );
    } else if (status === 'swap') {
      return (
        <BigButton
          text={t('swap.swap')}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          disabled={false}
          onPress={() => executeSwap()}
        />
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      //@ts-ignore
      keyboardVerticalOffset={Platform.select({
        ios: () => 50,
        android: () => 10,
      })()}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.close}>
          <Icon name="close" size={30} color={Colors.foreground} />
        </TouchableOpacity>
        <View style={{paddingVertical: 10, marginHorizontal: 30}}>
          <Text style={styles.title}>Swap</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setShowSlippage(true);
          }}
          style={styles.slippage}>
          <Icon2 name="sliders" size={22} color={Colors.foreground} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View>
          <SegmentedControl
            inactiveTintColor={Colors.lighter}
            initialSelectedName={swapChain}
            style={styles.segment}
            onChangeValue={name => changeChain(name)}>
            <Segment name="ETH" content={'Ethereum'} />
            <Segment name="BSC" content={'BSC'} />
            <Segment name="POLYGON" content={'Polygon'} />
          </SegmentedControl>
        </View>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={[styles.swapContainer, {}]}>
            <View style={[styles.swapItem, {}]}>
              <View style={{flex: 2.5}}>
                <Text style={styles.youPay}>{t('swap.you_pay')}</Text>
                <TextInput
                  style={styles.amount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.lighter}
                  value={sellAmmount}
                  onChangeText={v => {
                    setSellAmount(v);
                    resetToPreview();
                  }}
                />
              </View>
              <SwapCoin
                setShow={setShowFrom}
                tokenSymbol={sellTokenSymbol}
                tokenLogo={sellTokenLogo}
                styles={styles}
              />
            </View>
            <TouchableOpacity style={styles.connector} onPress={reverse}>
              <Icon name="swap-vertical" size={20} color={Colors.foreground} />
            </TouchableOpacity>

            <View style={[styles.swapItem, {}]}>
              <View style={{flex: 2.5}}>
                <Text style={styles.youPay}>{t('swap.you_get')}</Text>
                <TextInput
                  style={styles.amount}
                  value={buyAmmount}
                  placeholder="0"
                  placeholderTextColor={'gray'}
                  editable={false}
                />
              </View>
              <SwapCoin
                setShow={setShowTo}
                tokenSymbol={buyTokenSymbol}
                tokenLogo={buyTokenLogo}
                styles={styles}
              />
            </View>
            {keyboardEnabled ? null : renderDetails()}
          </View>
          <View style={{marginBottom: 30}}>{renderAction()}</View>
        </View>
      </ScrollView>
      {showFrom ? CoinsList(true) : null}
      {showTo ? CoinsList(false) : null}
      <Dialog.Container visible={showSlippage}>
        <Dialog.Title>{t('swap.slippage')}</Dialog.Title>
        <Dialog.Description>
          {t('swap.slippage_description')}
        </Dialog.Description>
        <Dialog.Input
          keyboardType="numeric"
          autoFocus
          defaultValue={String(slippage * 100)}
          value={slippageText.toString()}
          onChangeText={v => setSlippageText(v)}
        />
        <Dialog.Button
          label={t('swap.slippage_cancel')}
          onPress={() => {
            setSlippageText(slippage * 100);
            setShowSlippage(false);
          }}
        />
        <Dialog.Button
          label={t('swap.slippage_save')}
          onPress={() => {
            let slp = Number(slippageText) / 100;
            if (isNaN(slp)) {
              slp = 0.005;
              setSlippageText(slp * 100);
            }
            setSlippage(slp);
            setShowSlippage(false);
            setStatus('preview');
          }}
        />
      </Dialog.Container>
    </KeyboardAvoidingView>
  );
};

export default SwapScreen;
