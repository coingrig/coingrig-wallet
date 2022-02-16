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
import apps from './apps';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {Logs} from 'services/logs';
import {styles} from './styles';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Colors} from 'utils/colors';

export default function Featured() {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const soon = () => {
    showMessage({
      message: t('dashboard.coming_soon'),
      type: 'warning',
    });
  };

  const onClick = async item => {
    if (item.module) {
      navigation.navigate(item.screen);
    } else {
      try {
        if (await InAppBrowser.isAvailable()) {
          await InAppBrowser.open(item.screen, {
            dismissButtonStyle: 'cancel',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'automatic',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
            showTitle: true,
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: false,
          });
        } else {
          Linking.openURL(item.screen);
        }
      } catch (error) {
        Logs.error(error);
      }
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        key={item.screen}
        onPress={() => (item.enable ? onClick(item) : soon())}
        style={[styles.brick]}>
        <Image
          source={item.backgroundImage}
          resizeMode="contain"
          style={{
            width: 45,
            height: 45,
            justifyContent: 'center',
            backgroundColor: Colors.darker,
            borderRadius: 100,
            marginRight: 16,
          }}
        />
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.foreground,
              fontWeight: 'bold',
              marginBottom: 3,
            }}>
            {t(item.title)}
          </Text>
          <Text style={{fontSize: 13, color: Colors.lighter}}>
            {t(item.title)}
          </Text>
        </View>
        <Icon name="arrow-forward" size={20} color="gray" />
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView contentContainerStyle={{marginTop: 15}}>
      <TouchableOpacity
        onPress={() => null}
        style={{
          backgroundColor: Colors.darker,
          marginHorizontal: 16,
          borderRadius: 10,
          minHeight: 20,
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
      <View
        style={{
          margin: 16,
          backgroundColor: Colors.card,
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 5,
          marginTop: 20,
        }}>
        {apps.slice(0, 5).map(item => {
          return renderItem({item});
        })}
      </View>
    </ScrollView>
  );
}
