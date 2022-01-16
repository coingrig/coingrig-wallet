/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback, createRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'utils/colors';
import {styles} from './style';
import {Segment, SegmentedControl} from 'react-native-resegmented-control';
import {showMessage} from 'react-native-flash-message';
import SwapService from 'services/swap';
import {useTranslation} from 'react-i18next';
import ActionSheet from 'react-native-actions-sheet';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {WalletFactory} from '@coingrig/core';
import {BigButton} from 'components/bigButton';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {formatNoComma, sleep, toEth, toWei} from 'utils';
import endpoints from 'utils/endpoints';

const swapContainer: React.RefObject<any> = createRef();
const swapAllowanceContainer: React.RefObject<any> = createRef();

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
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardEnabled(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const fetchQuote = async (
    _buyToken,
    _sellToken,
    _sellAmount,
    exact = false,
  ) => {
    let params = {
      buyToken: _buyToken,
      sellToken: _sellToken,
      sellAmount: _sellAmount, // Always denominated in wei
      // slippagePercentage: 0.03,
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

  const checkPreview = async () => {
    if (
      !buyToken ||
      (!sellToken && (Number(buyAmmount) > 0 || Number(sellAmmount) > 0))
    ) {
      return;
    }
    const sellWallet = WalletStore.getWalletByCoinId(
      sellTokenSymbol,
      swapChain,
    );
    // Does the user have enough cash in his wallet to start the sell?
    if (sellWallet?.balance < sellAmmount) {
      showMessage({
        message: t('message.error.not_enough_balance'),
        type: 'warning',
      });
      return;
    }
    const buyWallet = WalletStore.getWalletByCoinId(buyTokenSymbol, swapChain);
    console.log('------', sellWallet?.decimals);
    let sellAmount = toWei(
      formatNoComma(sellAmmount),
      sellWallet?.decimals,
    ).toString();
    try {
      const success = await fetchQuote(buyToken, sellToken, sellAmount, false);
      if (!success) {
        showMessage({
          message: t('message.error.swap_not_found'),
          type: 'warning',
        });
        return;
      }
      console.log(success);
      setQuote(success);
      setBuyAmount(toEth(success.buyAmount, buyWallet?.decimals).toString());
      setSellAmount(toEth(success.sellAmount, sellWallet?.decimals).toString());
      startSwap(success);
    } catch (e) {
      console.log(e);
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
    setBuyTokenSymbol('Add');
    setBuyAmount('');
    setBuyTokenLogo(endpoints.assets + 'images/plus.png');
  };

  const changeChain = newChain => {
    setSwapChain(newChain);
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
    console.log('SHOULD RESET to PREVIEW/QUOTE -- Close Approve and/or Swap');
  };

  const getW3client = async () => {
    // Get the coresponding wallet for the chain
    let chainType = swapChain;
    // Get the coin descriptor for the chain native asset
    let cryptoWalletDescriptor = WalletStore.getWalletByCoinId(
      CryptoService.getChainNativeAsset(chainType),
      chainType,
    );
    // Get the chain private key for signature
    let chainKeys = await CryptoService.getChainPrivateKeys();
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

  const startSwap = async quoteInfo => {
    console.log(quoteInfo);
    if (
      quoteInfo.allowanceTarget !== '0x0000000000000000000000000000000000000000'
    ) {
      // Trading an ERC20 token, an allowance must be first set!
      console.log('Checking allowance');
      // Check if the contract has sufficient allowance
      let w3client = await getW3client();
      if (!w3client) {
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
        console.log(
          'Approval required',
          `${spendingAllowance} < ${quoteInfo.sellAmount}`,
        );
        prepareApproval(contract, quoteInfo);
        swapAllowanceContainer.current?.setModalVisible();
        return;
      } else {
        console.log('Allowance is sufficient');
      }
    } else {
      console.log('Allowance is not required');
    }
    // Get the exact quote now that allowance is OK and let the user send the transaction
    try {
      const sellWallet = WalletStore.getWalletByCoinId(
        sellTokenSymbol,
        swapChain,
      );
      // Does the user have enough cash in his wallet to start the sell?
      if (sellWallet?.balance < sellAmmount) {
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
      console.log('------', sellWallet?.decimals);
      let sellAmount = toWei(
        formatNoComma(sellAmmount),
        sellWallet?.decimals,
      ).toString();

      const success = await fetchQuote(buyToken, sellToken, sellAmount, true);
      if (!success) {
        showMessage({
          message: t('message.error.swap_not_found'),
          type: 'warning',
        });
        return;
      }
      console.log(success);
      setQuote(success);
      setBuyAmount(toEth(success.buyAmount, buyWallet?.decimals).toString());
      setSellAmount(toEth(success.sellAmount, sellWallet?.decimals).toString());
      swapContainer.current?.setModalVisible();
    } catch (e) {
      console.log(e);
      showMessage({
        message: e ?? t('message.error.swap_not_found'),
        type: 'warning',
      });
    }
  };

  const executeAllowance = async () => {
    console.log('executeAllowance');
    try {
      // Send the pre-set allowance action to the chain
      let tx = await allowanceAction.send({
        from: chainAddress,
        gas: allowanceFee,
      });
      console.log('allowance', tx);
      showMessage({
        message: t('message.swap_approved'),
        type: 'success',
      });
      swapAllowanceContainer.current?.setModalVisible(false);
      // Check again after approval if swap can be edxecuted
      checkPreview();
    } catch (ex) {
      console.log(ex);
      showMessage({
        message: t('message.error.swap_no_funds'),
        type: 'warning',
      });
    } finally {
      // swapAllowanceContainer.current?.setModalVisible(false);
    }
  };

  const executeSwap = async () => {
    try {
      // Get the coresponding wallet for the chain
      let chainType = swapChain;
      // Get the coin descriptor for the chain native asset
      let cryptoWalletDescriptor = WalletStore.getWalletByCoinId(
        CryptoService.getChainNativeAsset(chainType),
        chainType,
      );
      // Get the chain private key for signature
      let chainKeys = await CryptoService.getChainPrivateKeys();
      // Build the crypto wallet to send the transaction with
      let cryptoWallet = WalletFactory.getWallet(
        Object.assign({}, cryptoWalletDescriptor, {
          walletAddress: chainAddress,
          privKey: chainKeys.ETH,
        }),
      );
      let signingManager = cryptoWallet.getSigningManager();
      let w3client = signingManager?.client;
      if (!w3client || !quote) {
        return;
      }
      let x = await w3client.eth.sendTransaction({
        from: chainAddress,
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gasPrice: quote.gasPrice,
        gas: quote.gas,
      });
      console.log(x);
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
      swapContainer.current?.setModalVisible(false);
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
              flex: 5,
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
            {item.symbol.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const CoinsList = from => {
    return (
      <View style={styles.coinsSheet}>
        <View
          style={{
            paddingVertical: 10,
            marginHorizontal: 30,
            height: 52,
            justifyContent: 'center',
          }}>
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

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 52,
          justifyContent: 'center',
          // backgroundColor: Colors.darker,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.close}>
          <Icon name="close" size={25} color={Colors.foreground} />
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
          <View
            style={[styles.swapContainer, {flex: keyboardEnabled ? 0.5 : 4}]}>
            <View style={styles.swapItem}>
              <View style={{flex: 2.5}}>
                <Text style={styles.youPay}>You pay</Text>
                <TextInput
                  style={styles.amount}
                  keyboardType="numeric"
                  placeholder="0"
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

            <View style={styles.swapItem}>
              <View style={{flex: 2.5}}>
                <Text style={styles.youPay}>You get</Text>
                <TextInput
                  style={styles.amount}
                  value={buyAmmount}
                  placeholder="0"
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
          </View>
          <View style={{flex: 1}}>
            <BigButton
              text={t('swap.preview')}
              backgroundColor={Colors.foreground}
              color={Colors.background}
              disabled={false}
              onPress={() => checkPreview()}
            />
          </View>
        </View>
      </ScrollView>
      <ActionSheet
        //@ts-ignore
        ref={swapAllowanceContainer}
        gestureEnabled={true}
        headerAlwaysVisible
        containerStyle={styles.swapApproveContainer}>
        <View>
          <Text style={styles.youPay}>Grant permission for transaction</Text>
        </View>
        <View>
          <Text style={styles.youPay}>DEX will be allowed to Spend</Text>
          <Text style={styles.amount}>
            {quote ? quote.sellAmount : ''} {sellToken}
          </Text>
        </View>
        <View>
          <Text style={styles.youPay}>Fee</Text>
          <Text style={styles.amount}>
            {quote ? allowanceFee : ''} * {quote ? quote.gasPrice : ''}
          </Text>
        </View>
        <View>
          <BigButton
            text={t('swap.grant_allowance')}
            backgroundColor={Colors.foreground}
            color={Colors.background}
            onPress={executeAllowance}
          />
        </View>
      </ActionSheet>
      <ActionSheet
        //@ts-ignore
        ref={swapContainer}
        gestureEnabled={true}
        headerAlwaysVisible
        containerStyle={styles.swapApproveContainer}>
        <View>
          <Text style={styles.youPay}>Execute transaction</Text>
        </View>
        <View>
          <Text style={styles.youPay}>Receive</Text>
          <Text style={styles.amount}>
            {quote ? quote.buyAmount : ''} {buyToken}
          </Text>
        </View>
        <View>
          <Text style={styles.youPay}>Send</Text>
          <Text style={styles.amount}>
            {quote ? quote.sellAmount : ''} {sellToken}
          </Text>
        </View>
        <View>
          <Text style={styles.youPay}>at a price of</Text>
          <Text style={styles.amount}>{quote ? quote.price : ''}</Text>
        </View>
        <View>
          <Text style={styles.youPay}>Fee</Text>
          <Text style={styles.amount}>
            {quote ? quote.gas : ''} * {quote ? quote.gasPrice : ''}
          </Text>
        </View>
        <View>
          <BigButton
            text={t('swap.swap')}
            backgroundColor={Colors.foreground}
            color={Colors.background}
            onPress={executeSwap}
          />
        </View>
      </ActionSheet>

      {showFrom ? CoinsList(true) : null}
      {showTo ? CoinsList(false) : null}
    </View>
  );
};

export default SwapScreen;
