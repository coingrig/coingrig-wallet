import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';
import TokenPreview from 'components/widgets/TokenPreview';
import {Colors} from 'utils/colors';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {BigButton} from 'components/bigButton';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {Logs} from 'services/logs';
import {ILogEvents, LogEvents} from 'utils/analytics';

export default function CustomTokenScreen({route}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [selectedChain, setSelectedChain] = React.useState('Ethereum');
  const [token, setToken] = React.useState<any>(null);
  const [inProgress, setInProgress] = React.useState<boolean>(false);
  const [previewWallet, setPreviewWallet] = React.useState<any>(null);

  useEffect(() => {
    if (route.params) {
      Logs.info(route.params);
      // coingrig://add/polygon/0x0c51f415cf478f8d08c246a6c6ee180c5dc3a012
      autoTokenData();
    }
    LogEvents(ILogEvents.SCREEN, 'CustomToken');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCopiedText = async () => {
    setInProgress(true);
    setPreviewWallet(null);
    const clipboardToken = await Clipboard.getString();
    setToken(clipboardToken);
    let chain = 'Ethereum';
    switch (selectedChain) {
      case 'Ethereum':
        chain = 'ETH';
        break;
      case 'Binance Smart Chain':
        chain = 'BSC';
        break;
      case 'Polygon':
        chain = 'POLYGON';
        break;
      default:
        break;
    }
    Logs.info(token);
    try {
      const wallet = await CryptoService.prepareCustomToken(
        chain,
        clipboardToken,
        getTokenIcon(chain),
      );
      Logs.info(wallet);
      setPreviewWallet(wallet);
    } catch (error) {
      Logs.error(error);
      Alert.alert('Error', t('custom_token.network_error'));
    }

    setInProgress(false);
    // get token info & show preview
  };

  const addToken = async () => {
    if (previewWallet !== null) {
      const existingWallets = WalletStore.wallets.filter(
        o =>
          o.chain === previewWallet.chain &&
          (o.contract === previewWallet.contract ||
            o.symbol === previewWallet.symbol.toUpperCase()),
      );
      if (existingWallets.length === 0) {
        WalletStore.addWallet(previewWallet);
        showMessage({
          message: t('message.wallet.token.added'),
          type: 'success',
        });
        CryptoService.getAccountBalance();
        LogEvents(ILogEvents.ACTION, 'AddCustomToken');
        navigation.goBack();
      } else {
        Alert.alert('Info', t('message.wallet.token.already_exists'));
      }
    }
  };

  const getTokenIcon = chain => {
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

  const autoTokenData = async () => {
    try {
      setToken(route.params.token);
      switch (route.params.chain.toUpperCase()) {
        case 'ETH':
          setSelectedChain('Ethereum');
          break;
        case 'BSC':
          setSelectedChain('Binance Smart Chain');
          break;
        case 'POLYGON':
          setSelectedChain('Polygon');
          break;
        default:
          break;
      }
      const wallet = await CryptoService.prepareCustomToken(
        route.params.chain.toUpperCase(),
        route.params.token,
        getTokenIcon(route.params.chain.toUpperCase()),
      );
      Logs.info(wallet);
      setPreviewWallet(wallet);
    } catch (error) {
      Logs.error(error);
      Alert.alert('Error', t('custom_token.network_error'));
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1}}>
      <View>
        <View style={{flexDirection: 'row', marginVertical: 5}}>
          <Text style={styles.selectNetwork}>
            {t('custom_token.select_network')}
          </Text>
          <View style={styles.pill}>
            <Menu>
              <MenuTrigger text={selectedChain} customStyles={triggerStyles} />
              <MenuOptions customStyles={optionsStyles}>
                <MenuOption
                  onSelect={() => setSelectedChain('Ethereum')}
                  text="Ethereum"
                  customStyles={optionStyles}
                />
                <MenuOption
                  onSelect={() => setSelectedChain('Binance Smart Chain')}
                  text="Binance Smart Chain"
                  customStyles={optionStyles}
                />
                <MenuOption
                  onSelect={() => setSelectedChain('Polygon')}
                  text="Polygon"
                  customStyles={optionStyles}
                />
              </MenuOptions>
            </Menu>
          </View>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            value={token}
            editable={false}
            placeholder={t('custom_token.contract_address')}
            numberOfLines={1}
            returnKeyType="done"
            placeholderTextColor="gray"
            autoCompleteType={'off'}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => fetchCopiedText()}
            style={styles.moreBtn}>
            <Icon name="content-paste" size={20} color={Colors.foreground} />
          </TouchableOpacity>
        </View>
        <Text style={styles.warning}>{t('custom_token.disclaimer')}</Text>
        {inProgress ? (
          <ActivityIndicator
            size="small"
            color={Colors.foreground}
            style={{marginTop: 30}}
          />
        ) : null}
        {previewWallet !== null ? (
          <View>
            <Text style={styles.previewText}>{t('custom_token.preview')}</Text>
            <TokenPreview coin={previewWallet} />
          </View>
        ) : null}
      </View>
      <View style={{position: 'absolute', alignSelf: 'center', bottom: 40}}>
        <BigButton
          text={t('custom_token.add_asset')}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          disabled={!previewWallet}
          onPress={() => addToken()}
        />
      </View>
    </ScrollView>
  );
}

const triggerStyles = {
  TriggerTouchableComponent: TouchableOpacity,
  triggerText: {
    color: Colors.foreground,
    textAlign: 'center',
    fontSize: 14,
  },
  triggerOuterWrapper: {},
  triggerWrapper: {
    height: 30,
    justifyContent: 'center',
  },
};
const optionsStyles = {
  optionsContainer: {
    backgroundColor: Colors.card,
    padding: 5,
    // paddingBottom: 50,
  },
  optionText: {
    color: Colors.foreground,
    fontSize: 15,
  },
};

const optionStyles = {
  optionWrapper: {
    borderBottomWidth: 1,
    borderColor: Colors.background,
  },
  optionText: {
    color: Colors.foreground,
    padding: 10,
    fontSize: 15,
    fontFamily: 'RobotoSlab-Regular',
  },
};
