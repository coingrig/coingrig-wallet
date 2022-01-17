/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, createRef} from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'utils/colors';
import {styles} from './style';
import {Segment, SegmentedControl} from 'react-native-resegmented-control';
import {showMessage} from 'react-native-flash-message';
import SwapService from 'services/swap';
import {useTranslation} from 'react-i18next';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {BigButton} from 'components/bigButton';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {calcFee, formatFee, formatNoComma, sleep, toEth, toWei} from 'utils';
import endpoints from 'utils/endpoints';
import {LoadingModal} from 'services/loading';
import {Logs} from 'services/logs';

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

const SwapScreen = ({chain, from, to}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [swapChain, setSwapChain] = useState('ETH');
  const [status, setStatus] = useState('preview');
  const [slippage, setSlippage] = useState(0.005);
  // MATIC -> USDT
  // const [buyToken, setBuyToken] = useState(
  //   '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  // );
  // const [sellToken, setSellToken] = useState('matic');
  // USDT -> LINK
  const [sellTokenSymbol, setSellTokenSymbol] = useState('');
  const [sellToken, setSellToken] = useState('');
  const [sellTokenLogo, setSellTokenLogo] = useState('');
  const [sellAmmount, setSellAmount] = useState('0');

  const [buyTokenSymbol, setBuyTokenSymbol] = useState('');
  const [buyToken, setBuyToken] = useState('MATIC');
  const [buyTokenLogo, setBuyTokenLogo] = useState('');
  const [buyAmmount, setBuyAmount] = useState('0');

  const [quote, setQuote] = useState(null);
  const [allowanceAction, setAllowanceAction] = useState(null);
  const [allowanceFee, setAllowanceFee] = useState(null);
  const [chainAddress, setChainAddress] = useState(null);

  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const [keyboardEnabled, setKeyboardEnabled] = useState(false);

  useEffect(() => {
    //@ts-ignore
    setChainAddress(WalletStore.getWalletAddressByChain(swapChain));
    resetSwap('ETH', 'ETH');
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

    return () => {
      showSubscription.remove();
      willShowSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const fetchQuote = async (
    _buyToken,
    _sellToken,
    _sellAmount,
    exact = false,
  ) => {
    let params: any = {
      buyToken: _buyToken,
      sellToken: _sellToken,
      sellAmount: _sellAmount,
      slippagePercentage: slippage,
    };
    if (exact === true) {
      params.takerAddress = chainAddress;
    }
    try {
      return await SwapService.getQuote(swapChain, params);
    } catch (e) {
      return null;
    }
    // More info
    /*
      estimatedGas: "136000"
      gas: "136000"
      gasPrice: "303000000000"
      guaranteedPrice: "3031.259279474851002468"
      minimumProtocolFee: "0"
      sources: [{name: "0x", proportion: "0"}, {name: "Uniswap", proportion: "0"},…]
      price: "3061.878060075607073201"
      protocolFee: "0"
    */
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
    let sellAmount = toWei(
      formatNoComma(sellAmmount),
      sellWallet?.decimals,
    ).toString();
    try {
      const success = await fetchQuote(buyToken, sellToken, sellAmount, false);
      if (!success) {
        LoadingModal.instance.current?.hide();
        showMessage({
          message: t('message.error.swap_not_found'),
          type: 'warning',
        });
        return;
      }
      // console.log(success);
      setQuote(success);
      setBuyAmount(toEth(success.buyAmount, buyWallet?.decimals).toString());
      setSellAmount(toEth(success.sellAmount, sellWallet?.decimals).toString());
      // Does the user have enough cash in his wallet to start the sell?
      if (sellWallet?.balance < sellAmmount) {
        LoadingModal.instance.current?.hide();
        showMessage({
          message: t('message.error.not_enough_balance'),
          type: 'warning',
        });
        return;
      }
      startSwap(success);
    } catch (e) {
      console.log(e);
      LoadingModal.instance.current?.hide();
      showMessage({
        message: e ?? t('message.error.swap_not_found'),
        type: 'warning',
      });
    }

    // More info
    /*
      estimatedGas: "136000"
      gas: "136000"
      gasPrice: "303000000000"
      guaranteedPrice: "3031.259279474851002468"
      minimumProtocolFee: "0"
      sources: [{name: "0x", proportion: "0"}, {name: "Uniswap", proportion: "0"},…]
      price: "3061.878060075607073201"
      protocolFee: "0"
    */
  };

  const resetSwap = (defaultCoin, chain) => {
    setSellToken(defaultCoin);
    setSellTokenSymbol(defaultCoin);
    setSellAmount('');
    const logo = WalletStore.getWalletByCoinId(defaultCoin, chain)?.image;
    setSellTokenLogo(logo || '');
    setBuyToken('-');
    setBuyTokenSymbol('Select');
    setBuyAmount('');
    setBuyTokenLogo(endpoints.assets + 'images/plus.png');
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
    // console.log(quoteInfo);
    if (
      quoteInfo.allowanceTarget !== '0x0000000000000000000000000000000000000000'
    ) {
      // Trading an ERC20 token, an allowance must be first set!
      Logs.info('Checking allowance');
      // Check if the contract has sufficient allowance
      let w3client = await CryptoService.getWeb3Client(swapChain);
      if (!w3client) {
        LoadingModal.instance.current?.hide();
        showMessage({
          message: t('message.error.swap_chain_not_supported'),
          type: 'warning',
        });
      }
      let contract = new w3client!.eth.Contract(
        ERC20_ABI,
        quoteInfo.sellTokenAddress,
      );
      quoteInfo.from = chainAddress;
      const spendingAllowance = await contract.methods
        .allowance(quoteInfo.from, quoteInfo.allowanceTarget)
        .call();
      // Are we already allowed to sell the amount we desire?
      if (spendingAllowance < quoteInfo.sellAmount) {
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
      if (sellWallet?.balance < sellAmmount) {
        LoadingModal.instance.current?.hide();
        showMessage({
          message: t('message.error.not_enough_balance'),
          type: 'warning',
        });
        return;
      }
      const buyWallet = WalletStore.getWalletByCoinId(
        buyTokenSymbol,
        swapChain,
      );
      let sellAmount = toWei(
        formatNoComma(sellAmmount),
        sellWallet?.decimals,
      ).toString();

      const success = await fetchQuote(buyToken, sellToken, sellAmount, true);
      if (!success) {
        LoadingModal.instance.current?.hide();
        showMessage({
          message: t('message.error.swap_not_found'),
          type: 'warning',
        });
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
        message: e ?? t('message.error.swap_not_found'),
        type: 'warning',
      });
    }
  };

  const executeAllowance = async () => {
    Logs.info('executeAllowance');
    LoadingModal.instance.current?.show();
    try {
      // Send the pre-set allowance action to the chain
      let tx = await allowanceAction.send({
        from: chainAddress,
        gas: allowanceFee,
      });
      Logs.info('allowance', tx);
      showMessage({
        message: t('message.swap_approved'),
        type: 'success',
      });
      // swapAllowanceContainer.current?.setModalVisible(false);
      // Check again after approval if swap can be edxecuted
      sleep(1500);
      checkPreview(true);
    } catch (ex) {
      LoadingModal.instance.current?.hide();
      // console.log(ex);
      showMessage({
        message: t('message.error.swap_no_funds'),
        type: 'warning',
      });
    } finally {
      // swapAllowanceContainer.current?.setModalVisible(false);
    }
  };

  const executeSwap = async () => {
    LoadingModal.instance.current?.show();
    try {
      let w3client = await CryptoService.getWeb3Client(swapChain);
      if (!w3client) {
        showMessage({
          message: t('message.error.swap_chain_not_supported'),
          type: 'warning',
        });
      }
      let tx = await w3client!.eth.sendTransaction({
        from: chainAddress,
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gasPrice: quote.gasPrice,
        gas: quote.gas,
      });
      // console.log(tx);
      showMessage({
        message: t('message.swap_executed'),
        type: 'success',
      });
    } catch (ex) {
      console.log(ex);
      showMessage({
        message: t('message.error.swap_failed'),
        type: 'warning',
      });
    } finally {
      // swapContainer.current?.setModalVisible(false);
      LoadingModal.instance.current?.hide();
      setStatus('preview');
      CryptoService.getAccountBalance();
    }
  };

  const prepareApproval = async (contract, quoteDetails) => {
    let action = await contract.methods.approve(
      quoteDetails.allowanceTarget,
      quoteDetails.sellAmount,
    );
    setAllowanceAction(action);
    let gasEstimate = await action.estimateGas();
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
        style={{
          flexDirection: 'row',
          flex: 1,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.brick,
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        <FastImage
          style={{
            width: 20,
            height: 20,
            marginRight: 0,
            justifyContent: 'center',
            alignSelf: 'center',
            marginVertical: 10,
          }}
          source={{
            uri: item.image,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              flex: 2,
              color: Colors.foreground,
              marginLeft: 10,
              fontSize: 17,
            }}
            numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            style={{
              flex: 1,
              color: Colors.lighter,
              marginLeft: 10,
              fontSize: 13,
              textAlign: 'right',
            }}
            numberOfLines={1}>
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
          <Text style={{color: Colors.lighter}}>Price 1 {sellTokenSymbol}</Text>
          <Text style={{color: Colors.foreground}}>
            {quote ? quote.price + ' ' + buyTokenSymbol : '-'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={{color: Colors.lighter}}>Slippage</Text>
          <Text style={{color: Colors.foreground}}>{slippage * 100} %</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={{color: Colors.lighter}}>Estimated Gas Fee</Text>
          <Text style={{color: Colors.foreground}}>
            {' '}
            {quote
              ? humanNumber(true, allowanceFee || quote.gas, quote.gasPrice)
              : '-'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={{color: Colors.lighter}}>Allowance</Text>
          <Text style={{color: Colors.foreground}}>Exact amount</Text>
        </View>
      </View>
    );
  };

  const CoinsList = from => {
    return (
      <View style={styles.coinsSheet}>
        <View
          style={{
            paddingVertical: 10,
            height: 60,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setShowFrom(false);
              setShowTo(false);
            }}
            style={styles.close}>
            <Icon name="arrow-back" size={30} color={Colors.foreground} />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: '400',
              letterSpacing: 1,
              fontFamily: 'RobotoSlab-Regular',
              fontSize: 20,
              justifyContent: 'center',
              textAlign: 'center',
              color: Colors.foreground,
            }}>
            Convert {from ? 'from' : 'to'}
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
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  paddingTop: 25,
                  color: Colors.lighter,
                  width: 230,
                  alignSelf: 'center',
                  paddingBottom: 50,
                }}>
                For more tokens, add them in your portfolio first
              </Text>
            );
          }}
          style={{paddingHorizontal: 15}}
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
          disabled={false}
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
      <View
        style={{
          height: 60,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.close}>
          <Icon name="close" size={30} color={Colors.foreground} />
        </TouchableOpacity>
        <View style={{paddingVertical: 10, marginHorizontal: 30}}>
          <Text
            style={{
              fontWeight: '400',
              letterSpacing: 1,
              fontFamily: 'RobotoSlab-Regular',
              fontSize: 20,
              justifyContent: 'center',
              textAlign: 'center',
              color: Colors.foreground,
            }}>
            Swap
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={{marginTop: 15}}>
          <SegmentedControl
            inactiveTintColor={Colors.lighter}
            initialSelectedName={swapChain}
            style={{
              marginHorizontal: 15,
              height: 35,
              backgroundColor: Colors.darker,
            }}
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
                <Text style={styles.youPay}>You pay</Text>
                <TextInput
                  style={styles.amount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.foreground}
                  value={sellAmmount}
                  onChangeText={t => {
                    setSellAmount(t);
                    resetToPreview();
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={styles.coin}
                  onPress={() => {
                    setShowFrom(true);
                  }}>
                  <FastImage
                    style={styles.tinyLogo}
                    source={{
                      uri: sellTokenLogo,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                  />
                  <Text style={styles.coinText} numberOfLines={1}>
                    {sellTokenSymbol}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.connector}>
              <Icon name="arrow-down" size={20} color={Colors.foreground} />
            </View>

            <View style={[styles.swapItem, {}]}>
              <View style={{flex: 2.5}}>
                <Text style={styles.youPay}>You get</Text>
                <TextInput
                  style={styles.amount}
                  value={buyAmmount}
                  placeholder="0"
                  placeholderTextColor={Colors.foreground}
                  editable={false}
                />
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={styles.coin}
                  onPress={() => {
                    setShowTo(true);
                  }}>
                  <FastImage
                    style={styles.tinyLogo}
                    source={{
                      uri: buyTokenLogo,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                  />
                  <Text style={styles.coinText} numberOfLines={1}>
                    {buyTokenSymbol}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {keyboardEnabled ? null : renderDetails()}
          </View>
          <View style={{marginBottom: 30}}>{renderAction()}</View>
        </View>
      </ScrollView>
      {showFrom ? CoinsList(true) : null}
      {showTo ? CoinsList(false) : null}
    </KeyboardAvoidingView>
  );
};

export default SwapScreen;
