import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import {SmallButton} from 'components/smallButton';
import {BigButton} from 'components/bigButton';
import {useState} from 'react';
import {WalletStore} from 'stores/wallet';
import {sleep} from 'utils';
import {LoadingModal} from 'services/loading';
import {Colors} from 'utils/colors';
import {COIN_LIST} from 'utils/constants';
import {showMessage} from 'react-native-flash-message';

export default function ValidateWalletScreen({route}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [copiedText, setCopiedText] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    createWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const fetchCopiedText = async () => {
    if (loading) {
      return;
    }
    const text = await Clipboard.getString();
    setCopiedText(text);
    if (text === route.params.mnemonic) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };
  const createWallet = async () => {
    if (loading) {
      //@ts-ignore
      LoadingModal.instance.current?.show();
      await sleep(500);
      const newWallet = await WalletStore.createWallets(
        route.params.mnemonic,
        COIN_LIST,
      );
      setLoading(false);
      if (newWallet) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'HomeScreens'}],
          }),
        );
      } else {
        // alert
        showMessage({
          message: t('message.error.unable_to_create_wallets'),
          type: 'danger',
        });
      }
    }
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topContainer}>
          <Text style={styles.subtitle}>
            {t('setup.verify_recovery_phrase')}
          </Text>
          <Text style={styles.paragraph}>
            {t('setup.paste_recovery_phrase')}
          </Text>
          <View style={styles.mnemonicsContainer}>
            <Text selectable style={styles.mnemonics}>
              {copiedText}
            </Text>
          </View>
          <SmallButton
            text={t('setup.paste')}
            onPress={fetchCopiedText}
            style={{backgroundColor: Colors.darker, marginTop: 30}}
            color={Colors.foreground}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.paragraphBottom}>{t('setup.copy_in_order')}</Text>
          <BigButton
            text={t('setup.create_wallet')}
            backgroundColor={Colors.foreground}
            color={Colors.background}
            disabled={isDisabled}
            onPress={() => setLoading(true)}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  topContainer: {
    flex: 2,
  },
  bottomContainer: {
    flex: 1,
    marginTop: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  mnemonicsContainer: {
    marginTop: 40,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.foreground,
    borderStyle: 'dashed',
    minHeight: 130,
    justifyContent: 'center',
  },
  mnemonics: {
    textAlign: 'center',
    lineHeight: 25,
    fontSize: 19,
    letterSpacing: 1,
    color: Colors.foreground,
    fontFamily: 'RobotoSlab-Regular',
  },
  subtitle: {
    marginBottom: 10,
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'RobotoSlab-Light',
    color: Colors.lighter,
  },
  paragraphBottom: {
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'RobotoSlab-Light',
    color: Colors.lighter,
  },
});
