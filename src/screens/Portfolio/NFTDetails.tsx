import React from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Colors} from 'utils/colors';
import {Logs} from 'services/logs';
import {useNavigation} from '@react-navigation/native';

const NFTScreen = props => {
  const {item} = props.route.params;
  const navigation = useNavigation();

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
    <View style={{flex: 1, backgroundColor: Colors.stats}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          backgroundColor: Colors.background,
          width: 45,
          height: 45,
          left: 10,
          top: 15,
          zIndex: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 100,
        }}>
        <Icon name="close" size={30} color={Colors.foreground} />
      </TouchableOpacity>
      <Image
        style={{
          height: 300,
        }}
        defaultSource={require('assets/no-image.jpg')}
        resizeMode="cover"
        source={{
          uri: item.image_url,
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          paddingVertical: 15,
        }}>
        <View style={{flex: 1, paddingHorizontal: 15, paddingBottom: 150}}>
          <Text
            style={{
              fontSize: 13,
              color: Colors.lighter,
              fontFamily: 'RobotoSlab-Regular',
              marginTop: 0,
            }}>
            {'Created Date: ' +
              new Date(item.asset_contract.created_date).toDateString() ?? null}
          </Text>
          <Text
            style={{
              fontSize: 26,
              color: Colors.foreground,
              fontFamily: 'RobotoSlab-Bold',
              marginTop: 10,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: Colors.foreground,
              fontFamily: 'RobotoSlab-Bold',
              marginTop: 25,
            }}>
            {'Item Description'}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: Colors.foreground,
              fontFamily: 'RobotoSlab-Regular',
              marginTop: 10,
            }}>
            {item.description ?? '- No description'}
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: Colors.foreground,
              fontFamily: 'RobotoSlab-Bold',
              marginTop: 25,
            }}>
            {'Contract Description'}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: Colors.foreground,
              fontFamily: 'RobotoSlab-Regular',
              marginTop: 10,
            }}>
            {item.asset_contract.description ?? '- No description'}
          </Text>
        </View>
      </ScrollView>
      <Animatable.View
        animation="bounceIn"
        delay={300}
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          position: 'absolute',
          bottom: 30,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          height: 50,
          minWidth: '70%',
          backgroundColor: Colors.foreground,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          borderRadius: 50,
        }}>
        <Text
          style={{
            color: Colors.background,
            flex: 1,
            textAlign: 'center',
          }}
          numberOfLines={1}>
          {'Sales: ' + item.num_sales ?? 0}
        </Text>
        <TouchableOpacity
          style={{flex: 1, alignItems: 'center'}}
          onPress={() => openLink(item.permalink)}>
          <Image
            style={{
              height: 60,
              width: 60,
            }}
            source={require('assets/opensea.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={{color: Colors.background, flex: 1, textAlign: 'center'}}
          numberOfLines={1}>
          {item.asset_contract.symbol}
        </Text>
      </Animatable.View>
    </View>
  );
};

export default NFTScreen;
