import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import apps from './apps';
import {styles} from './styles';
import {Colors} from 'utils/colors';

const HubScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {}, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => null}
        style={{
          flex: 1,
          flexDirection: 'column',
          margin: 5,
          height: 160,
          backgroundColor: Colors.card,
          borderRadius: 10,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: Colors.darker,
        }}>
        <ImageBackground
          source={item.backgroundImage}
          resizeMode="cover"
          imageStyle={{opacity: 0.8, justifyContent: 'flex-end'}}
          style={{flex: 1, borderRadius: 10, justifyContent: 'flex-end'}}>
          <Text
            style={{
              fontSize: 17,
              paddingHorizontal: 10,
              fontWeight: 'bold',
              color: Colors.foreground,
              backgroundColor: Colors.darker,
              paddingTop: 5,
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 13,
              paddingHorizontal: 10,
              paddingTop: 3,
              color: Colors.lighter,
              paddingBottom: 5,
              backgroundColor: Colors.darker,
            }}>
            {item.description}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.title}>{t('Hub')} </Text>
        </View>
      </View>
      <FlatList
        data={apps}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item, index) => index}
        style={{padding: 15}}
      />
    </View>
  );
};

export default HubScreen;
