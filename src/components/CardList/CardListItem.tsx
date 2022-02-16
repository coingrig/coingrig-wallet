import {View, Text, TouchableOpacity, Image, Linking} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Logs} from 'services/logs';

export default function CardListItem(item) {
  const {t} = useTranslation();
  const navigation = useNavigation();

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
  return (
    <TouchableOpacity
      key={item.screen}
      onPress={() => (item.enable ? onClick(item) : null)}
      style={[styles.brick]}>
      <Image
        source={item.backgroundImage}
        resizeMode="contain"
        style={{
          width: 45,
          height: 45,
          justifyContent: 'center',
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
      {item.module ? (
        <Icon name="arrow-forward" size={20} color="gray" />
      ) : (
        <Icon2 name="external-link" size={20} color="gray" />
      )}
    </TouchableOpacity>
  );
}
