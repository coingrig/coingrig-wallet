/* eslint-disable react-native/no-inline-styles */
import TwoBricks from 'components/Bricks/twoBricks';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MarketStore} from 'stores/market';
import {Colors} from 'utils/colors';
import endpoints from 'utils/endpoints';
import {styles} from './styles';

export const OtherMarkets = observer(() => {
  const {t} = useTranslation();
  return (
    <View
      style={{flex: 1, marginHorizontal: 16, marginTop: 10, marginBottom: 0}}>
      <View
        style={[
          styles.subContainer,
          {marginTop: 0, marginBottom: 5, marginLeft: -15},
        ]}>
        <Icon
          name="globe-americas"
          size={15}
          color={Colors.lighter}
          style={styles.icons}
        />
        <Text style={styles.subtitle}>{t('market.other_markets')}</Text>
      </View>
      <TwoBricks
        symbol1=".IXIC:INDEXNASDAQ"
        title1={'Nasdaq'}
        image1={endpoints.assets + '/images/flags/us.png'}
        value1={MarketStore.markets['^IXIC'].price || '-'}
        subValue1={
          MarketStore.markets['^IXIC'].changePercentage.toFixed(2) + '%' || '-'
        }
        symbol2="UKX:INDEXFTSE"
        title2={'FTSE 100'}
        image2={endpoints.assets + '/images/flags/uk.png?new'}
        value2={MarketStore.markets['^FTSE'].price || '-'}
        subValue2={
          MarketStore.markets['^FTSE'].changePercentage.toFixed(2) + '%' || '-'
        }
      />
      <TwoBricks
        symbol1="DAX:INDEXDB"
        title1={'DAX'}
        image1={endpoints.assets + '/images/flags/de.png'}
        value1={MarketStore.markets['^GDAXI'].price || '-'}
        subValue1={
          MarketStore.markets['^GDAXI'].changePercentage.toFixed(2) + '%' || '-'
        }
        symbol2="NI225:INDEXNIKKEI"
        title2={'Nikkei 225'}
        image2={endpoints.assets + '/images/flags/japan.png?new'}
        value2={MarketStore.markets['^N225'].price || '-'}
        subValue2={
          MarketStore.markets['^N225'].changePercentage.toFixed(2) + '%' || '-'
        }
      />
      <TwoBricks
        symbol1="CL=F"
        title1={'Crude Oil'}
        image1={endpoints.assets + '/images/oil.png'}
        value1={MarketStore.markets['CL=F'].price || '-'}
        subValue1={
          MarketStore.markets['CL=F'].changePercentage.toFixed(2) + '%' || '-'
        }
        symbol2="GC=F"
        title2={'Gold'}
        image2={endpoints.assets + '/images/gold.png'}
        value2={MarketStore.markets['GC=F'].price || '-'}
        subValue2={
          MarketStore.markets['GC=F'].changePercentage.toFixed(2) + '%' || '-'
        }
      />
    </View>
  );
});

export const USMarkets = observer(() => {
  const {t} = useTranslation();
  return (
    <View
      style={{flex: 1, marginHorizontal: 16, marginTop: 5, marginBottom: 5}}>
      <View
        style={[
          styles.subContainer,
          {marginTop: 0, marginBottom: 5, marginLeft: -15},
        ]}>
        <Icon
          name="chart-line"
          size={15}
          color={Colors.lighter}
          style={styles.icons}
        />
        <Text style={styles.subtitle}>{t('market.us_markets')}</Text>
      </View>
      <TwoBricks
        symbol1=".INX:INDEXSP"
        title1={'S&P 500'}
        image1={endpoints.assets + '/images/flags/us.png'}
        value1={MarketStore.markets['^GSPC'].price || '-'}
        subValue1={
          MarketStore.markets['^GSPC'].changePercentage.toFixed(2) + '%' || '-'
        }
        symbol2=".DJI:INDEXDJX"
        title2={'DJI'}
        image2={endpoints.assets + '/images/flags/us.png'}
        value2={MarketStore.markets['^DJI'].price || '-'}
        subValue2={
          MarketStore.markets['^DJI'].changePercentage.toFixed(2) + '%' || '-'
        }
      />
    </View>
  );
});
