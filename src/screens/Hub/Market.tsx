import apps from 'data/apps';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import CardList from 'components/CardList';

const marketData = apps.filter(app => app.categories?.includes('market'));

export default function MarketTab() {
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={{marginTop: 10, marginHorizontal: 16}}>
      <CardList
        data={marketData.filter(app => app.module)}
        title={t('Trends, news and market data')}
        categorie={t('MARKET')}
      />
      <CardList
        data={marketData.filter(app => !app.module)}
        categorie={null}
        title={null}
      />
    </ScrollView>
  );
}
