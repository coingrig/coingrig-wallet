import React, {useEffect, createRef} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Switch,
} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import ActionSheet from 'react-native-actions-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import {showMessage} from 'react-native-flash-message';
import {SettingsStore} from 'stores/settings';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {Colors} from 'utils/colors';
import {clearAllAppData} from 'utils';
import {SmallButton} from 'components/smallButton';
import CONFIG from 'config';
import {styles} from './styles';
import {observer} from 'mobx-react-lite';

const actionSheetRef = createRef();

const SettingScreen = observer(() => {
  const {t} = useTranslation();

  useEffect(() => {}, []);

  const copyToClipboard = () => {
    Clipboard.setString(CONFIG.mnemonic);
    showMessage({
      message: t('message.success.mnemonic_copied'),
      type: 'success',
    });
    //@ts-ignore
    actionSheetRef.current?.setModalVisible(false);
  };

  const deleteWallets = async () => {
    Alert.alert(
      t('settings.delete_wallets'),
      t('settings.alert_delete_wallets'),
      [
        {
          text: t('settings.cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('settings.yes'),
          onPress: async () => {
            await clearAllAppData();
          },
        },
      ],
    );
  };

  const openLink = async url => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'automatic',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <View>
        <Text style={styles.title}>{t('settings.settings')}</Text>
      </View> */}
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View>
          <Text style={styles.subtitle}>{t('settings.wallet')}</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              //@ts-ignore
              actionSheetRef.current?.setModalVisible();
            }}>
            <Icon name="key" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.backup_phrase')}</Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              SettingsStore.setConfirmation(!SettingsStore.confirmationEnabled)
            }>
            <Icon name="checkmark-circle" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.unconfirmed')}</Text>
            <Switch
              trackColor={{false: Colors.background, true: Colors.background}}
              thumbColor={
                SettingsStore.confirmationEnabled
                  ? '#5cb85c'
                  : Colors.background
              }
              ios_backgroundColor={
                SettingsStore.confirmationEnabled
                  ? '#5cb85c'
                  : Colors.background
              }
              onValueChange={() =>
                SettingsStore.setConfirmation(
                  !SettingsStore.confirmationEnabled,
                )
              }
              value={SettingsStore.confirmationEnabled}
            />
          </TouchableOpacity>
          <Text style={styles.unconfirmed}>
            {t('settings.unconfirmed_txt')}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitle}>{t('settings.about')}</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('https://coingrig.com/privacy')}>
            <Icon name="document-text" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>
              {t('settings.privacy_and_policy')}
            </Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('https://coingrig.com/terms')}>
            <Icon name="document-text" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>
              {t('settings.terms_of_services')}
            </Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('https://coingrig.com')}>
            <Icon name="link" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.website')}</Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('https://twitter.com/coingrig')}>
            <Icon name="logo-twitter" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.twitter')}</Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('https://github.com/coingrig')}>
            <Icon name="logo-github" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.github')}</Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('https://coingrig.com/credits')}>
            <Icon name="help-buoy" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.credits')}</Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginVertical: 20, color: Colors.foreground}}>
          {t('settings.version')}: {CONFIG.APP_VERSION}
        </Text>
        <TouchableOpacity
          style={styles.itemDelete}
          onPress={() => deleteWallets()}>
          <Icon name="trash-bin" size={23} color="white" />
          <Text style={styles.textDelete}>{t('settings.delete_wallets')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <ActionSheet
        //@ts-ignore
        ref={actionSheetRef}
        gestureEnabled={true}
        headerAlwaysVisible
        // eslint-disable-next-line react-native/no-inline-styles
        containerStyle={{flex: 1, backgroundColor: Colors.background}}>
        <View style={{backgroundColor: Colors.background}}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginTop: 15,
              fontFamily: 'RobotoSlab-Bold',
              color: Colors.foreground,
            }}>
            {t('setup.your_recovery_phrase')}
          </Text>
          <View style={styles.mnemonicsContainer}>
            <Text selectable style={styles.mnemonics}>
              {CONFIG.mnemonic}
            </Text>
          </View>
        </View>
        <SmallButton
          text={t('setup.copy')}
          onPress={() => copyToClipboard()}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{backgroundColor: Colors.foreground, marginTop: 30}}
          color={Colors.inverse}
        />
        <Text style={styles.paragraph}>{t('setup.copy_these_words')}</Text>
      </ActionSheet>
    </View>
  );
});

export default SettingScreen;
