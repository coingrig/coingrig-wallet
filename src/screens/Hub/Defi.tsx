import apps from 'data/apps';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import CardList from 'components/CardList';
import {styles} from './styles';
import External from 'components/CardList/External';

const data = apps.filter(app => app.categories?.includes('defi'));

export default function Defi() {
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      <CardList
        data={data.filter(app => app.module)}
        title={t('Trends, news and market data')}
        category={t('DEFI')}
      />
      <External />
      <CardList
        data={data.filter(app => !app.module)}
        category={null}
        title={null}
      />
    </ScrollView>
  );
}
