import {ScrollView} from 'react-native';
import React from 'react';
import apps from '../../data/apps';
import {useTranslation} from 'react-i18next';
import CardList from 'components/CardList';
import CardImage from 'components/CardImage';

export default function Featured() {
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={{marginTop: 10, marginHorizontal: 16}}>
      <CardImage
        imageURI={
          'https://cdn.pixabay.com/photo/2020/12/06/16/16/cosmos-5809271_1280.png'
        }
        category={'INFO'}
        title={'Some news'}
        desc={
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
        }
      />
      <CardList
        data={apps.filter(app => app.categories?.includes('featured'))}
        title={t('Shortcuts for your needs')}
        category={t('SHORTCUTS')}
      />
    </ScrollView>
  );
}
