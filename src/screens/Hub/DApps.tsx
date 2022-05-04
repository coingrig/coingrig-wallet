/* eslint-disable react-native/no-inline-styles */
import CardList from 'components/CardList';
import Separator from 'components/CardList/Separator';
import apps from 'data/apps';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import {styles} from './styles';

const marketData = apps.filter(app => app.categories?.includes('dapps'));

export default function DApps() {
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      {/* <Separator title={t('hub.modules').toUpperCase()} />
      <CardList
        data={marketData.filter(app => app.module)}
        title={null}
        category={null}
      /> */}
      <Separator title={t('hub.external_links').toUpperCase()} />
      <CardList
        data={marketData.filter(app => !app.module)}
        category={null}
        title={null}
      />
    </ScrollView>
  );
}
