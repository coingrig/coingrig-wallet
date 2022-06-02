import {ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Segment, SegmentedControl} from 'react-native-resegmented-control';
import {Colors} from 'utils/colors';
import {styles} from './styles';
import {useTranslation} from 'react-i18next';
import SellComponent from 'components/Trade/Sell';
import BuyComponent from 'components/Trade/Buy';

export default function TradeScreen({route}) {
  const {t} = useTranslation();
  const [isSell, setIsSell] = useState(false);

  useEffect(() => {
    console.log(route.params);
    // const w = WalletStore.getWalletByCoinId(
    //     route.params.symbol,
    //     route.params.chain,
    //   );
    //   const address = WalletStore.getWalletAddressByChain(w?.chain!);
    //   let coin = route.params.symbol.toUpperCase();
    //   if (coin === 'BNB') {
    //     coin = 'BSC_BNB';
    //   }
  }, [route.params]);

  const renderContainer = () => {
    if (isSell) {
      return <SellComponent />;
    } else {
      return <BuyComponent />;
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
        <Segment name="sell" content={t('Sell')} />
      </SegmentedControl>
      {renderContainer()}
    </ScrollView>
  );
}
