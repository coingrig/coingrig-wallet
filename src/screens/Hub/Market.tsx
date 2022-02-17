import apps from 'data/apps';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import CardList from 'components/CardList';
import {styles} from './styles';
import External from 'components/CardList/External';

const marketData = apps.filter(app => app.categories?.includes('market'));

export default function MarketTab() {
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      <CardList
        data={marketData.filter(app => app.module)}
        title={t('Trends, news and market data')}
        category={t('MARKET')}
      />
      <External />
      <CardList
        data={marketData.filter(app => !app.module)}
        category={null}
        title={null}
      />
    </ScrollView>
  );
}
