import React, {useEffect, createRef} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
  Linking,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import {showMessage} from 'react-native-flash-message';
import {SettingsStore} from 'stores/settings';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {Colors} from 'utils/colors';
import {clearAllAppData, openLink} from 'utils';
import {SmallButton} from 'components/smallButton';
import CONFIG from 'config';
import {styles} from './styles';
import {observer} from 'mobx-react-lite';
import {ConfigStore} from 'stores/config';
import {APPLE_UPDATE_LINK, GOOGLE_UPDATE_LINK} from 'utils/constants';

const actionSheetRef = createRef();

const SettingScreen = observer(() => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {}, []);

  const copyToClipboard = () => {
    Clipboard.setString(CONFIG.mnemonic);
    SettingsStore.setMnemonicBackupDone(true);
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

  const badge = () => <View style={styles.badge} />;

  const renderUpdate = () => {
    return !ConfigStore.requiresUpdate ? null : (
      <View>
        <Text style={styles.subtitle}>
          {t('settings.update').toUpperCase()}
        </Text>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            let link = '';
            if (Platform.OS === 'android') {
              link = GOOGLE_UPDATE_LINK;
            }
            if (Platform.OS === 'ios') {
              link = APPLE_UPDATE_LINK;
            }
            Linking.canOpenURL(link).then(
              supported => {
                supported && Linking.openURL(link);
              },
              err => console.log(err),
            );
          }}>
          {ConfigStore.requiresUpdate ? badge() : null}
          <Icon
            name="cloud-download-outline"
            size={23}
            color={Colors.foreground}
          />
          <Text style={styles.textItem}>{t('settings.update_app')}</Text>
          <Icon name="arrow-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderReferral = () => {
    if (!ConfigStore.getModuleProperty('referral', 'enabled', false)) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('InviteScreen')}>
        <Icon name="gift" size={23} color={Colors.foreground} />
        <Text style={styles.textItem}>{t('referral.title')}</Text>
        <Icon name="arrow-forward" size={20} color="gray" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollview}
        showsVerticalScrollIndicator={false}>
        <View>
          {renderUpdate()}
          <Text style={styles.subtitle}>
            {t('settings.wallet').toUpperCase()}
          </Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              //@ts-ignore
              actionSheetRef.current?.setModalVisible();
            }}>
            {SettingsStore.mnemonicBackupDone ? null : badge()}
            <Icon name="key" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.backup_phrase')}</Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
          {renderReferral()}
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('LanguageScreen')}>
            <Icon name="language" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.change_language')}</Text>
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
          <Text style={styles.subtitle}>
            {t('settings.about').toUpperCase()}
          </Text>
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
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('FeedbackScreen')}>
            <Icon2 name="star-half-alt" size={20} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('settings.feedback')}</Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('https://governance.coingrig.com')}>
            <Icon2 name="vote-yea" size={20} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('Governance')}</Text>
            <Icon name="arrow-forward" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{marginVertical: 20, color: Colors.foreground}}>
          {t('settings.version')}: {CONFIG.APP_VERSION}
        </Text>
        <SmallButton
          text={t('settings.delete_wallets')}
          onPress={() => deleteWallets()}
          color="#f2eded"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: Colors.red,
            width: '100%',
            borderColor: Colors.red,
          }}
        />
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
