import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import apps from '../../data/apps';
import {useTranslation} from 'react-i18next';
import {Colors} from 'utils/colors';
import CardList from 'components/CardList';

export default function Featured() {
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={{marginTop: 10, marginHorizontal: 16}}>
      <TouchableOpacity
        onPress={() => null}
        style={{
          backgroundColor: Colors.darker,
          borderRadius: 10,
          minHeight: 20,
          marginBottom: 20,
        }}>
        <FastImage
          source={{
            uri: 'https://cdn.pixabay.com/photo/2020/12/06/16/16/cosmos-5809271_1280.png',
          }}
          resizeMode="cover"
          style={{
            height: 200,
            width: '100%',
            justifyContent: 'center',
            alignSelf: 'center',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}
        />
        <View style={{margin: 15}}>
          <Text style={{color: Colors.lighter, marginBottom: 3}}>INFO</Text>
          <Text
            style={{
              color: Colors.foreground,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Some text
          </Text>
          <Text
            style={{
              color: Colors.lighter,
              fontSize: 13,
              marginTop: 4,
            }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
        </View>
      </TouchableOpacity>
      <CardList
        data={apps.filter(app => app.categories?.includes('featured'))}
        title={t('Shortcuts for your needs')}
        categorie={t('SHORTCUTS')}
      />
    </ScrollView>
  );
}
