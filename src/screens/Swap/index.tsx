/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback, createRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'utils/colors';
import {styles} from './style';
import {showMessage} from 'react-native-flash-message';
import SwapService from 'services/swap';
import {useTranslation} from 'react-i18next';
import ActionSheet from 'react-native-actions-sheet';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {WalletFactory} from '@coingrig/core';
import {BigButton} from 'components/bigButton';

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
  // MATIC -> USDT
  // const [buyToken, setBuyToken] = useState(
  //   '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  // );
  // const [sellToken, setSellToken] = useState('matic');
  // USDT -> LINK
  const [buyToken, setBuyToken] = useState('MATIC');
  const [sellToken, setSellToken] = useState('USDC');

  const [swapChain, setSwapChain] = useState('POLYGON');
  const [buyAmmount, setBuyAmount] = useState(0);
  const [sellAmmount, setSellAmount] = useState('400');
  const [quote, setQuote] = useState(null);
  const [allowance, setAllowance] = useState(null);
  const [allowanceFee, setAllowanceFee] = useState(null);
  const [chainAddress, setChainAddress] = useState(null);

  useEffect(() => {
    setChainAddress(WalletStore.getWalletAddressByChain(swapChain));
    fetchQuote();
  }, []);

  const fetchQuote = useCallback(async () => {
    if (!buyToken || (!sellToken && (buyAmmount > 0 || sellAmmount > 0))) {
      return;
    }
    let params = {
      buyToken: buyToken,
      sellToken: sellToken,
      sellAmount: sellAmmount, //'1000000000000000000', // Always denominated in wei
      takerAddress: chainAddress,
    };
    const success = await SwapService.getQuote(swapChain, params);
    if (!success) {
      showMessage({
        message: t('message.error.swap_not_found'),
        type: 'warning',
      });
      return;
    }
    console.log(success);

    setBuyAmount(success.buyAmount);
    setSellAmount(success.sellAmount);
    setQuote(success);
    console.log(success.allowanceTarget);

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
  }, []);

  const startSwap = async () => {
    if (
      quote.allowanceTarget !== '0x0000000000000000000000000000000000000000'
    ) {
      // Trading an ERC20 token, an allowance must be first set!
      prepareApproval();
      swapAllowanceContainer.current?.setModalVisible();
    } else {
      swapContainer.current?.setModalVisible();
    }
  };

  const executeAllowance = async () => {
    console.log('executeAllowance');
    try {
      let tx = await allowance.send({
        from: chainAddress,
        gas: allowanceFee,
      });
      console.log('allowance', tx);
      showMessage({
        message: t('message.swap_approved'),
        type: 'success',
      });
      swapContainer.current?.setModalVisible();
    } catch (ex) {
      console.log(ex);
      showMessage({
        message: t('message.error.swap_no_funds'),
        type: 'warning',
      });
    } finally {
      swapAllowanceContainer.current?.setModalVisible(false);
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

  const prepareApproval = async () => {
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
    let contract = new w3client.eth.Contract(ERC20_ABI, quote.sellTokenAddress);
    let action = await contract.methods.approve(
      quote.allowanceTarget,
      quote.sellAmount,
    );
    setAllowance(action);
    let gasEstimate = await action.estimateGas();
    setAllowanceFee(gasEstimate);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.swapContainer}>
          <View style={styles.swapItem}>
            <View style={{flex: 3}}>
              <Text style={styles.youPay}>You pay</Text>
              <TextInput
                style={styles.amount}
                keyboardType="numeric"
                placeholder="100"
              />
              {/* <Text style={styles.amount} numberOfLines={1}>
                {sellAmmount}
              </Text> */}
            </View>
            <View style={{flex: 1}}>
              <View style={styles.coin}>
                <Image
                  style={styles.tinyLogo}
                  source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
                />
                <Text style={styles.coinText} numberOfLines={1}>
                  {sellToken}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.connector}>
            <Icon name="swap-vertical" size={20} color={Colors.foreground} />
          </View>

          <View style={styles.swapItem}>
            <View style={{flex: 3}}>
              <Text style={styles.youPay}>You get</Text>
              <Text style={styles.amount}>{buyAmmount}</Text>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity style={styles.coin} onPress={() => startSwap()}>
                <Image
                  style={styles.tinyLogo}
                  source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
                />
                <Text style={styles.coinText} numberOfLines={1}>
                  {buyToken}
                </Text>
              </TouchableOpacity>
            </View>
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
    </View>
  );
};

export default SwapScreen;
