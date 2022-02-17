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
import {showMessage} from 'react-native-flash-message';

export default function CardListItem(item, isLast) {
  const {t} = useTranslation();
  const navigation = useNavigation();

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

  const renderType = () => {
    if (item.enable) {
      if (item.module) {
        return <Icon name="arrow-forward" size={20} color="gray" />;
      } else {
        return <Icon2 name="external-link" size={20} color="gray" />;
      }
    } else {
      return (
        <Text
          style={{
            color: 'gray',
            fontSize: 11,
            width: 60,
            textAlign: 'right',
          }}>
          {t('dashboard.coming_soon')}
        </Text>
      );
    }
  };

  return (
    <TouchableOpacity
      key={item.title}
      onPress={() => (item.enable ? onClick(item) : soon())}
      style={[styles.brick, {borderBottomWidth: isLast ? 0 : 1}]}>
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
      {renderType()}
    </TouchableOpacity>
  );
}
