import React from 'react';
import {View, Text, Image, Linking, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
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
      <ParallaxScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        fadeOutForeground={false}
        backgroundColor={Colors.stats}
        contentBackgroundColor={Colors.stats}
        parallaxHeaderHeight={350}
        stickyHeaderHeight={55}
        renderFixedHeader={() => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              backgroundColor: Colors.background,
              width: 40,
              height: 40,
              left: 10,
              top: 10,
              zIndex: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
            }}>
            <Icon name="close" size={30} color={Colors.foreground} />
          </TouchableOpacity>
        )}
        renderStickyHeader={() => <></>}
        renderForeground={() => (
          <>
            <Image
              style={{
                height: 350,
              }}
              defaultSource={require('assets/no-image.png')}
              resizeMode="cover"
              source={{
                uri: item.image_url,
              }}
            />
          </>
        )}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
            // height: '100%',
            // paddingBottom: 150,
            backgroundColor: Colors.stats,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: Colors.lighter,
              fontFamily: 'RobotoSlab-Regular',
              marginTop: 15,
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
              marginTop: 15,
            }}>
            {'Item Description'}
          </Text>
          <Text
            style={{
              fontSize: 13,
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
              fontSize: 13,
              color: Colors.foreground,
              fontFamily: 'RobotoSlab-Regular',
              marginTop: 10,
            }}>
            {item.asset_contract.description ?? '- No description'}
          </Text>
        </View>
      </ParallaxScrollView>
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
          height: 45,
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
              height: 55,
              width: 55,
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
