/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from 'utils/colors';
import {SIZE} from 'utils/constants';

export default function Card() {
  const {t} = useTranslation();

  return (
    <ScrollView
      style={{flexGrow: 1}}
      contentContainerStyle={{
        marginTop: 10,
        marginHorizontal: 16,
        flexGrow: 1,
        height: SIZE.height / 1.5,
      }}>
      <View style={{justifyContent: 'center', flex: 1}}>
        <FastImage
          source={require('../../assets/hub/card2.png')}
          resizeMode="contain"
          style={{
            height: 150,
            width: '100%',
            justifyContent: 'center',
            alignSelf: 'center',
            opacity: 0.5,
          }}
        />
        <Text
          style={{
            fontSize: 19,
            color: Colors.lighter,
            textAlign: 'center',
            fontWeight: 'bold',
            opacity: 0.3,
            marginTop: 50,
          }}>
          {t('dashboard.coming_soon').toUpperCase()}
        </Text>
      </View>
    </ScrollView>
  );
}
