/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {WalletStore} from 'stores/wallet';
import {CryptoService} from 'services/crypto';
import {useTranslation} from 'react-i18next';
import Brick from 'components/brick';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {ListPrices} from 'components/widgets/listPrices';
import {formatPrice} from '../../utils';
import {observer} from 'mobx-react-lite';
import {Loader} from 'components/loader';
import {LoadingModal} from 'services/loading';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import {showMessage} from 'react-native-flash-message';
import {CONFIG_MODULES, CONFIG_PROPERTIES, ConfigStore} from 'stores/config';

const DashboardScreen = observer(() => {
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [showMarketing, setShowMarketing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SettingScreen')}
          style={styles.moreBtn}>
          <Icon2 name="settings-sharp" size={23} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    fetchBalance();
    setShowMarketing(
      ConfigStore.getModuleProperty(
        CONFIG_MODULES.MARKETING_HOME,
        CONFIG_PROPERTIES.MARKETING_HOME.DISPLAY_NEWS,
        false,
      ),
    );
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalance();
  }, []);

  const fetchBalance = useCallback(async () => {
    let success = await CryptoService.getAccountBalance();
    if (!success) {
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
    }
    setRefreshing(false);
    //@ts-ignore
    LoadingModal.instance.current?.hide();
  }, []);

  const Marketing = () => {
    if (!showMarketing) {
      return null;
    }
    return (
      <View>
        <View style={styles.subContainer}>
          <Icon
            name="info-circle"
            size={15}
            color={Colors.lighter}
            style={styles.icons}
          />
          <Text style={styles.subtitle}>{t('dashboard.coming_soon')}</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoContainer}>
            <Icon name="coins" size={19} color={Colors.lighter} />
            <Text style={styles.infoText}>{t('dashboard.manage_tokens')}</Text>
          </View>
          <View style={styles.vLine} />
          <View style={styles.infoContainer}>
            <Icon name="vector-square" size={19} color={Colors.lighter} />
            <Text style={styles.infoText}>{t('dashboard.manage_nfts')}</Text>
          </View>
        </View>
      </View>
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
            {formatPrice(WalletStore.totalBalance) || 0.0}
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
              contentContainerStyle={{paddingHorizontal: 15}}>
              {WalletStore.wallets.slice(0, 2).map((v, i) => {
                return <Brick coin={v.symbol} key={i} />;
              })}
              <Brick coin={'_END_'} key={'_END_'} />
            </ScrollView>
            {Marketing()}
            <View style={[styles.subContainer, {marginTop: 10}]}>
              <Icon
                name="list-ul"
                size={15}
                color={Colors.lighter}
                style={styles.icons}
              />
              <Text style={styles.subtitle}>{t('dashboard.top_3_coins')}</Text>
            </View>
            <ListPrices />
          </View>
        </View>
      </View>
    );
  };
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.lighter}
          colors={[Colors.lighter]}
        />
      }>
      {preRender()}
    </ScrollView>
  );
});

export default React.memo(DashboardScreen);
