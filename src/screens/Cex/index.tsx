import {ScrollView, View} from 'react-native';
import React, {useEffect} from 'react';
import apps from '../../data/apps';
import {useTranslation} from 'react-i18next';
import CardList from 'components/CardList';
import CardImage from 'components/CardImage';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';
import CEX_LIST from 'data/cex';

export default function CEXScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {}, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      <View style={{marginHorizontal: 16}}>
        <CardList data={CEX_LIST} title={null} category={null} />
      </View>
    </ScrollView>
  );
}
