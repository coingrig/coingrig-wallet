/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WalletStore} from 'stores/wallet';
import {CryptoService} from 'services/crypto';
import DeepLinkService from 'services/deeplink';
import {useTranslation} from 'react-i18next';
import Brick from 'components/Bricks';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/Ionicons';
import {ListPrices} from 'components/widgets/listPrices';
import {formatPrice, sleep} from '../../utils';
import {observer} from 'mobx-react-lite';
import {Loader} from 'components/loader';
import NotificationService from 'services/notifications';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import {showMessage} from 'react-native-flash-message';
import AppsStateService from 'services/appStates';
import CexService from 'services/cex';
import BanksService from 'services/banks';
import StockService from 'services/stocks';
import {useNavigation} from '@react-navigation/native';
import {SettingsStore} from 'stores/settings';
import {BankStore} from 'stores/bankStore';
import {FiatStore} from 'stores/fiatStore';
import {CexStore} from 'stores/cexStore';
import {StockStore} from 'stores/StockStore';
import CardList from 'components/CardList';
import apps from 'data/apps';
import {OtherMarkets, USMarkets} from './markets';
import {ILogEvents, LogEvents} from 'utils/analytics';
import FastImage from 'react-native-fast-image';
import {ConfigStore} from 'stores/config';
// import CustomModal from 'components/Modal';

const marketData = apps.filter(app => app.categories?.includes('home'));

const DashboardScreen = observer(() => {
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [shadowHeader, setShadowHeader] = useState(false);

  useEffect(() => {
    AppsStateService.coldStart = false;
    // LoadingModal.door.current?.count = 2;
    if (DeepLinkService.data) {
      DeepLinkService.handleDeepLink(DeepLinkService.data);
    }
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FeedbackScreen')}
            style={styles.moreBtn}>
            <Icon name="star-half-alt" size={21} color={Colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SettingScreen')}
            style={styles.moreBtn}>
            {SettingsStore.mnemonicBackupDone && !ConfigStore.requiresUpdate
              ? null
              : badge()}
            <Icon3 name="settings-sharp" size={23} color={Colors.foreground} />
          </TouchableOpacity>
        </View>
      ),
    });
    fetchBalance();
  }, [SettingsStore.mnemonicBackupDone, ConfigStore.requiresUpdate]);

  useEffect(() => {
    if (shadowHeader) {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: Colors.background,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 1.41,

          elevation: 2,
        },
      });
    } else {
      navigation.setOptions({
        headerStyle: {
          shadowColor: 'transparent', // ios
          elevation: 0, // android
          backgroundColor: Colors.background,
        },
      });
    }
  }, [shadowHeader]);

  useEffect(() => {
    LogEvents(ILogEvents.SCREEN, 'Dashboard');
  }, []);

  const badge = () => <View style={styles.badge} />;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalance();
  }, []);

  const fetchBalance = useCallback(async () => {
    const success = await CryptoService.getAccountBalance();
    CexService.getAllBalances();
    BanksService.updateAccountsBalance();
    StockService.updateAllStocks();
    if (!success) {
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
    }
    setRefreshing(false);
    DeviceEventEmitter.emit('hideDoor');
    await sleep(2000);
    NotificationService.askForPermission();
  }, []);

  const QuickAction = () => {
    return (
      <View style={{flex: 1, marginHorizontal: 16, marginTop: 5}}>
        <View
          style={[
            styles.subContainer,
            {marginTop: 0, marginBottom: 5, marginLeft: -15},
          ]}>
          <Icon
            name="newspaper"
            size={15}
            color={Colors.lighter}
            style={styles.icons}
          />
          <Text style={styles.subtitle}>{t('dashboard.quick_actions')}</Text>
        </View>
        <CardList data={marketData} title={null} category={null} />
      </View>
    );
  };

  const onScroll = y => {
    if (y > 25) {
      if (!shadowHeader) {
        setShadowHeader(true);
      }
    } else if (y < 25) {
      if (shadowHeader) {
        setShadowHeader(false);
      }
    }
  };

  const renderReferral = () => {
    if (!ConfigStore.getModuleProperty('referral', 'enabled', false)) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('InviteScreen')}
        style={{
          flex: 1,
          marginHorizontal: 16,
          marginTop: 20,
          marginBottom: 5,
          borderRadius: 10,
          borderWidth: 3,
          borderStyle: 'dashed',
          borderColor: Colors.dash,
          backgroundColor: Colors.card,
          justifyContent: 'center',
          height: 80,
        }}>
        <Text
          style={{
            fontSize: 15,
            textAlign: 'left',
            fontWeight: '500',
            marginLeft: 15,
            lineHeight: 20,
            color: Colors.foreground,
            width: 220,
          }}>
          {t('referral.earn_up_to')}{' '}
          <Text style={{color: 'orange', fontWeight: 'bold'}}>$1000</Text>{' '}
          {t('referral.earn_from_friend')}
        </Text>
        <FastImage
          style={{
            width: 45,
            height: 45,
            position: 'absolute',
            right: 15,
          }}
          source={{
            uri: 'https://assets.coingrig.com/images/star.png',
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
      </TouchableOpacity>
    );
  };

  const preRender = () => {
    if (WalletStore.wallets.length === 0) {
      return Loader();
    }
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.balance}>{t('dashboard.my_balance')}</Text>
          <Text style={styles.fiatValue} adjustsFontSizeToFit numberOfLines={1}>
            {formatPrice(
              WalletStore.totalBalance +
                BankStore.totalBalance +
                FiatStore.totalBalance +
                CexStore.totalBalance +
                StockStore.totalBalance,
              true,
            ) || 0.0}
          </Text>
          <View style={{marginTop: 20, width: '100%'}}>
            <View style={styles.subContainer}>
              <Icon
                name="wallet"
                size={15}
                color={Colors.lighter}
                style={styles.icons}
              />
              <Text style={styles.subtitle}>{t('dashboard.wallets')}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 10}}>
              <Brick
                title={t('portfolio.categories.crypto')}
                key={0}
                size={35}
                value={WalletStore.totalBalance + CexStore.totalBalance}
                icon={'bitcoin'}
                color={'orange'}
                tab={'Crypto'}
              />
              <Brick
                title={t('portfolio.categories.banks')}
                key={1}
                size={30}
                value={BankStore.totalBalance}
                icon={'bank'}
                color={'#2c8af2'}
                tab={'Banks'}
              />
              <Brick
                title={'_END_'}
                key={'_END_'}
                value={StockStore.totalBalance + FiatStore.totalBalance}
                icon={'menu'}
                size={32}
                color={Colors.background}
                tab={'Stocks'}
              />
            </ScrollView>
            {renderReferral()}
            <USMarkets />
            <View
              style={[styles.subContainer, {marginTop: 0, marginBottom: 5}]}>
              <Icon
                name="list-ul"
                size={15}
                color={Colors.lighter}
                style={styles.icons}
              />
              <Text style={[styles.subtitle, {marginBottom: 6}]}>
                {t('dashboard.top_3_coins')}
              </Text>
            </View>
            <ListPrices />
            <OtherMarkets />
            {QuickAction()}
          </View>
        </View>
      </View>
    );
  };
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={200}
      onScroll={e => onScroll(e.nativeEvent.contentOffset.y)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.lighter}
          colors={[Colors.lighter]}
        />
      }>
      {preRender()}
      {/* <CustomModal show={true} /> */}
    </ScrollView>
  );
});

export default React.memo(DashboardScreen);
