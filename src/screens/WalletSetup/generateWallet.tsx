import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';
import {SmallButton} from 'components/smallButton';
import {BigButton} from 'components/bigButton';
import {Colors} from 'utils/colors';
import {generateMnemonic} from '@coingrig/wallet-generator';

const GenerateWalletScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [mnemonic, setMnemonic] = React.useState<string>(
    t('setup.generating_mnemonic'),
  );
  React.useEffect(() => {
    generateWallet();
  }, []);

  const generateWallet = async () => {
    const words = 12; // or 24
    const newMnemonic = await generateMnemonic(words);
    setMnemonic(newMnemonic);
  };

  const copyToClipboard = () => {
    Clipboard.setString(mnemonic);
    showMessage({
      message: t('message.success.mnemonic_copied'),
      type: 'success',
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topContainer}>
          <Text style={styles.subtitle}>{t('setup.your_recovery_phrase')}</Text>
          <Text style={styles.paragraph}>{t('setup.copy_these_words')}</Text>
          <View style={styles.mnemonicsContainer}>
            <Text selectable style={styles.mnemonics}>
              {mnemonic}
            </Text>
          </View>
          <SmallButton
            text={t('setup.copy')}
            onPress={copyToClipboard}
            style={{backgroundColor: Colors.darker, marginTop: 30}}
            color={Colors.foreground}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.paragraphBottom}>{t('setup.never_share')}</Text>
          <BigButton
            text={t('setup.continue')}
            backgroundColor={Colors.foreground}
            color={Colors.background}
            onPress={() =>
              navigation.navigate('ValidateWalletScreen', {
                mnemonic: mnemonic,
              })
            }
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

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
    color: Colors.lighter,
    marginBottom: 20,
    fontSize: 15,
    width: '90%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'RobotoSlab-Light',
  },
});

export default GenerateWalletScreen;
