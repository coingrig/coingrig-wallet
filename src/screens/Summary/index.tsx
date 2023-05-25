/* eslint-disable react-native/no-inline-styles */
import {ScrollView, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {PieChart} from 'react-native-chart-kit';
import {SIZE} from 'utils/constants';
import {WalletStore} from 'stores/wallet';
import {CexStore} from 'stores/cexStore';
import {BankStore} from 'stores/bankStore';
import {StockStore} from 'stores/StockStore';
import {FiatStore} from 'stores/fiatStore';
import {Colors} from 'utils/colors';
import {styles} from './styles';
import {useTranslation} from 'react-i18next';
import {formatPrice} from 'utils';

export default function SummaryScreen() {
  const {t} = useTranslation();
  const sortedData = useMemo(() => {
    const total =
      WalletStore.totalBalance +
      CexStore.totalBalance +
      BankStore.totalBalance +
      StockStore.totalBalance +
      FiatStore.totalBalance;
    if (total === 0) {
      return [
        {
          name: 'No money',
          money: 1,
          color: '#003F5C',
        },
      ];
    }
    return [
      {
        name: 'Crypto',
        money: WalletStore.totalBalance + CexStore.totalBalance,
        color: '#003F5C',
      },
      {
        name: 'Bank',
        money: BankStore.totalBalance || 0,
        color: '#58508D',
      },
      {
        name: 'Stocks',
        money: StockStore.totalBalance || 0,
        color: '#BC5090',
      },
      {
        name: 'Cash',
        money: FiatStore.totalBalance || 0,
        color: '#FF6361',
      },
    ];
  }, []);

  const calcPercentage = value => {
    const total =
      WalletStore.totalBalance +
      CexStore.totalBalance +
      BankStore.totalBalance +
      StockStore.totalBalance +
      FiatStore.totalBalance;
    if (total === 0) {
      return '0%';
    }
    let percent: any = (value / total) * 100;
    percent = percent.toFixed(2) ?? 0;
    return (percent || 0) + '%';
  };

  const renderColor = type => {
    let color = 'white';
    switch (type) {
      case 'crypto':
        color = '#003F5C';
        break;
      case 'bank':
        color = '#58508D';
        break;
      case 'stocks':
        color = '#BC5090';
        break;
      case 'cash':
        color = '#FF6361';
        break;
      default:
        break;
    }
    return (
      <View
        style={{
          width: 15,
          height: 15,
          borderRadius: 50,
          backgroundColor: color,
        }}
      />
    );
  };

  return (
    <ScrollView>
      <View>
        <PieChart
          data={sortedData}
          width={SIZE.width}
          height={270}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={
            {
              // marginRight: 10,
              // marginLeft: 10,
            }
          }
          accessor={'money'}
          backgroundColor={Colors.darker}
          //@ts-ignore
          paddingLeft={SIZE.width / 4}
          center={[0, 0]}
          absolute
          hasLegend={false}
        />
      </View>
      <View style={styles.viewStatsDetail}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: 'RobotoSlab-Bold',
            color: Colors.foreground,
            marginTop: 10,
          }}>
          {formatPrice(
            WalletStore.totalBalance +
              CexStore.totalBalance +
              BankStore.totalBalance +
              StockStore.totalBalance +
              FiatStore.totalBalance,
          )}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: Colors.foreground,
            fontWeight: 'bold',
            marginTop: 20,
          }}>
          {t('summary.distribution')}
        </Text>
        <View style={styles.item}>
          <Text style={styles.itemtext}>{t('summary.category.crypto')}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textr}>
              {calcPercentage(WalletStore.totalBalance + CexStore.totalBalance)}
            </Text>
            <Text style={[styles.textr, {marginHorizontal: 10}]}>
              {formatPrice(WalletStore.totalBalance + CexStore.totalBalance)}
            </Text>
            {renderColor('crypto')}
          </View>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemtext}>{t('summary.category.banks')}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textr}>
              {calcPercentage(BankStore.totalBalance)}
            </Text>
            <Text style={[styles.textr, {marginHorizontal: 10}]}>
              {formatPrice(BankStore.totalBalance)}
            </Text>
            {renderColor('bank')}
          </View>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemtext}>{t('summary.category.stocks')}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textr}>
              {calcPercentage(StockStore.totalBalance)}
            </Text>
            <Text style={[styles.textr, {marginHorizontal: 10}]}>
              {formatPrice(StockStore.totalBalance)}
            </Text>
            {renderColor('stocks')}
          </View>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemtext}>{t('summary.category.cash')}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textr}>
              {calcPercentage(FiatStore.totalBalance)}
            </Text>
            <Text style={[styles.textr, {marginHorizontal: 10}]}>
              {formatPrice(FiatStore.totalBalance)}
            </Text>
            {renderColor('cash')}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
