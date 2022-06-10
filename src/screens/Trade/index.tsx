import {ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Segment, SegmentedControl} from 'react-native-resegmented-control';
import {Colors} from 'utils/colors';
import {styles} from './styles';
import {useTranslation} from 'react-i18next';
import SellComponent from 'components/Trade/Sell';
import BuyComponent from 'components/Trade/Buy';
import {useNavigation} from '@react-navigation/native';

export default function TradeScreen({route}) {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [isSell, setIsSell] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.symbol.toUpperCase(),
    });
    alert(
      'De verificat fiecare coin in parte daca merge cumparat pe ambii provideri',
    );
  }, [navigation, route.params]);

  const renderContainer = () => {
    if (isSell) {
      return (
        <SellComponent
          coin={route.params.symbol}
          chain={route.params.chain}
          price={route.params.price}
        />
      );
    } else {
      return (
        <BuyComponent
          coin={route.params.symbol}
          chain={route.params.chain}
          price={route.params.price}
        />
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <SegmentedControl
        inactiveTintColor={Colors.lighter}
        initialSelectedName={isSell ? 'sell' : 'buy'}
        style={styles.segment}
        onChangeValue={name =>
          name === 'sell' ? setIsSell(true) : setIsSell(false)
        }>
        <Segment name="buy" content={t('Buy')} />
        <Segment
          name="sell"
          content={
            route.params.symbol === 'MATIC'
              ? t('Sell (Not available)')
              : t('Sell')
          }
          disabled={route.params.symbol === 'MATIC'}
        />
      </SegmentedControl>
      {renderContainer()}
    </ScrollView>
  );
}
