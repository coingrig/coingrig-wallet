import {ScrollView} from 'react-native';
import React from 'react';
import apps from '../../data/apps';
import {useTranslation} from 'react-i18next';
import CardList from 'components/CardList';
import CardImage from 'components/CardImage';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';

export default function Featured() {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      <CardImage
        //@ts-ignore
        onClick={() => navigation.navigate('SwapScreen')}
        imageURI={'https://coingrig.com/images/assets/coinsi.png'}
        category={t('hub.featured').toUpperCase()}
        title={t('hub.featured.title')}
        desc={t('hub.featured.description')}
      />
      <CardList
        data={apps.filter(app => app.categories?.includes('featured'))}
        title={t('hub.shortcuts.description')}
        category={t('hub.shortcuts').toUpperCase()}
      />
    </ScrollView>
  );
}
