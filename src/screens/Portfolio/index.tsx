/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Colors} from 'utils/colors';
import {observer} from 'mobx-react-lite';
import {styles} from './styles';
import {WalletStore} from 'stores/wallet';
import {formatPrice} from 'utils';
import Portfolios from 'data/portfolios';
import {BankStore} from 'stores/bankStore';
import {FiatStore} from 'stores/fiatStore';
import {CexStore} from 'stores/cexStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SmallLogo} from 'routes';
import {StockStore} from 'stores/StockStore';
import {ILogEvents, LogEvents} from 'utils/analytics';

const PortfolioScreen = observer(({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const scrollRef: any = useRef();
  const [screen, setScreen] = useState(Portfolios[0]);
  const [shadowHeader, setShadowHeader] = useState(false);
  const flatListRef = React.useRef();

  useEffect(() => {
    LogEvents(ILogEvents.SCREEN, 'Portfolio/' + screen.title);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!route.params || route.params.tab === null) {
        return;
      }
      if (route.params.tab === 'Banks') {
        setScreen(Portfolios[3]);
        scrollRef.current?.scrollTo({
          x: 90,
          animated: true,
        });
      }
      if (route.params.tab === 'Crypto') {
        setScreen(Portfolios[0]);
        scrollRef.current?.scrollTo({
          x: 0,
          animated: true,
        });
      }
      LogEvents(ILogEvents.SCREEN, 'Portfolio/' + route.params.tab);
      route.params.tab = null;
    }, [route.params]),
  );

  useEffect(() => {
    if (shadowHeader) {
      navigation.setOptions({
        headerTitle: () => (
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              fontFamily: 'RobotoSlab-Bold',
              color: Colors.foreground,
            }}>
            {formatPrice(
              WalletStore.totalBalance +
                BankStore.totalBalance +
                FiatStore.totalBalance +
                CexStore.totalBalance +
                StockStore.totalBalance,
              true,
            ) || 0.0}
          </Text>
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: () => <SmallLogo />,
      });
    }
  }, [
    navigation,
    shadowHeader,
    WalletStore.totalBalance,
    BankStore.totalBalance,
    FiatStore.totalBalance,
    CexStore.totalBalance,
    StockStore.totalBalance,
  ]);

  const bubble = (item, index) => {
    return (
      <TouchableOpacity
        key={item.title}
        onPress={() => {
          setScreen(item);
          scrollRef.current?.scrollTo({
            x: index * 30,
            animated: true,
          });
          try {
            if (shadowHeader) {
              flatListRef.current?.scrollToIndex({animated: true, index: 1});
            } else {
              flatListRef.current?.scrollToIndex({animated: true, index: 0});
            }
          } catch (error) {}
          LogEvents(ILogEvents.SCREEN, 'Portfolio/' + item.title);
        }}
        style={{
          backgroundColor:
            screen.title === item.title ? Colors.foreground : Colors.bubble,
          flex: 1,
          padding: 5,
          paddingHorizontal: 15,
          borderRadius: 15,
          marginHorizontal: 3,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          minWidth: 70,
        }}>
        <Text
          style={{
            fontSize: 14,
            color:
              screen.title === item.title ? Colors.background : Colors.lighter,
          }}>
          {t(item.description)}
        </Text>
      </TouchableOpacity>
    );
  };

  const header = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.title} numberOfLines={1}>
          {formatPrice(
            WalletStore.totalBalance +
              BankStore.totalBalance +
              FiatStore.totalBalance +
              CexStore.totalBalance +
              StockStore.totalBalance,
            true,
          ) || 0.0}
        </Text>
      </View>
    );
  };

  const menu = () => {
    return (
      <View style={shadowHeader ? styles.headerShadow : styles.headerNoShadow}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingRight: 20}}
          style={{
            paddingTop: 10,
            paddingHorizontal: 12,
            paddingBottom: 10,
          }}>
          {Portfolios.map((item, index) => bubble(item, index))}
        </ScrollView>
      </View>
    );
  };

  const onScroll = y => {
    if (y > 50) {
      if (!shadowHeader) {
        setShadowHeader(true);
      }
    } else if (y < 50) {
      if (shadowHeader) {
        setShadowHeader(false);
      }
    }
  };

  const renderItem = ({index}) => {
    if (index === 0) {
      return header();
    }
    if (index === 1) {
      return menu();
    }
    if (index === 2) {
      return <screen.component />;
    }
    return null;
  };

  return (
    <FlatList
      data={[1, 2, 3]}
      ref={flatListRef}
      renderItem={renderItem}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{flexGrow: 1}}
      style={styles.container}
      stickyHeaderIndices={[1]}
      scrollEventThrottle={200}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item: any, index) => index.toString() ?? ''}
      onScroll={e => onScroll(e.nativeEvent.contentOffset.y)}
    />
  );
});

export default PortfolioScreen;
