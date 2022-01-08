import React, {useEffect} from 'react';
import {View, Text, Image, Linking} from 'react-native';
import {Colors} from 'utils/colors';
import {Logs} from 'services/logs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export default function NFTCard({item}) {
  const openLink = async url => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
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
        Linking.openURL(url);
      }
    } catch (error) {
      Logs.error(error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => openLink(item.permalink)}
      style={{
        marginHorizontal: 15,
        backgroundColor: Colors.card,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
      <Image
        style={{
          height: 200,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        defaultSource={require('assets/no-image.jpg')}
        resizeMode="cover"
        source={{
          uri: item.image_url,
        }}
      />
      <View style={{padding: 10}}>
        <Text
          style={{
            fontSize: 16,
            color: Colors.foreground,
            fontFamily: 'RobotoSlab-Bold',
          }}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
