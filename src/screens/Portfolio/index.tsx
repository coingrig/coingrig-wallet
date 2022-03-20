/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Colors} from 'utils/colors';
import {observer} from 'mobx-react-lite';
import {styles} from './styles';
import {WalletStore} from 'stores/wallet';
import {formatPrice} from 'utils';
import Portfolios from 'data/portfolios';
import {BankStore} from 'stores/bankStore';

const PortfolioScreen = observer(() => {
  const {t} = useTranslation();
  const scrollRef: any = useRef();
  const [screen, setScreen] = useState(Portfolios[0]);

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
        }}
        style={{
          backgroundColor:
            screen.title === item.title ? Colors.foreground : Colors.darker,
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
              screen.title === item.title
                ? Colors.background
                : Colors.foreground,
          }}>
          {t(item.title)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.title} numberOfLines={1}>
            {formatPrice(
              WalletStore.totalBalance + BankStore.totalBalance,
              true,
            ) || 0.0}
          </Text>
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingRight: 20}}
          style={{paddingTop: 10, paddingHorizontal: 12, paddingBottom: 5}}>
          {Portfolios.map((item, index) => bubble(item, index))}
        </ScrollView>
      </View>
      <screen.component />
    </View>
  );
});

export default PortfolioScreen;
