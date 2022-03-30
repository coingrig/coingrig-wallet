/* eslint-disable react-native/no-inline-styles */
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import COUNTRIES from 'data/countries';
import FastImage from 'react-native-fast-image';
import endpoints from 'utils/endpoints';
import {Colors} from 'utils/colors';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

export default function SelectCountry() {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        //@ts-ignore
        onPress={() =>
          item.enable ? navigation.replace('AddBankScreen', {item}) : null
        }
        style={{
          flexDirection: 'row',
          paddingVertical: 20,
          alignItems: 'center',
        }}>
        <FastImage
          style={{width: 36, height: 24, borderRadius: 5}}
          source={{
            uri: endpoints.assets + '/images/flags/' + item.code + '.png',
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <Text style={{paddingLeft: 10, color: Colors.foreground}}>
          {item.name}
        </Text>
        <Text
          style={{
            color: Colors.lighter,
            marginLeft: 10,
          }}>
          {!item.enable ? '(' + t('dashboard.coming_soon') + ')' : null}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={COUNTRIES}
      renderItem={renderItem}
      keyExtractor={item => item.code}
      maxToRenderPerBatch={10}
      initialNumToRender={15}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => (
        <View style={{height: 1, backgroundColor: Colors.border}} />
      )}
      style={{
        paddingHorizontal: 16,
      }}
      ListHeaderComponent={null}
      ListFooterComponent={() => <View style={{height: 30}} />}
    />
  );
}
