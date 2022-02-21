import {ScrollView, View} from 'react-native';
import React, {useEffect} from 'react';
import apps from '../../data/apps';
import {useTranslation} from 'react-i18next';
import CardList from 'components/CardList';
import CardImage from 'components/CardImage';
import {useNavigation} from '@react-navigation/native';
import CexService from 'services/cex';
import {Logs} from 'services/logs';
import {styles} from './styles';
import CEX_LIST from 'data/cex';

export default function CEXScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    // test();
  }, []);

  const test = async () => {
    // console.log(CexService.exchanges);
    const balance = await CexService.getBalance('binance');
    Logs.info(balance);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      {/* <CardImage
        //@ts-ignore
        onClick={null}
        imageURI={'https://coingrig.com/images/assets/coinsi.png'}
        category={t('CONNECTORS').toUpperCase()}
        title={t('Connect to your CEX')}
        desc={t('hub.featured.description')}
      /> */}
      <View style={{marginHorizontal: 16}}>
        <CardList data={CEX_LIST} title={null} category={null} />
      </View>
    </ScrollView>
  );
}
