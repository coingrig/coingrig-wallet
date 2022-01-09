import React from 'react';
import {View, Text, Image, Linking, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
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
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <ParallaxScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        fadeOutForeground={false}
        backgroundColor={Colors.background}
        contentBackgroundColor={Colors.background}
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
            // paddingHorizontal: 15,
            // height: '100%',
            // paddingBottom: 150,
            backgroundColor: Colors.background,
          }}>
          <View
            style={{
              paddingHorizontal: 15,
              backgroundColor: Colors.darker,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: Colors.lighter,
                fontFamily: 'RobotoSlab-Regular',
              }}>
              {'Created Date: ' +
                new Date(item.asset_contract.created_date).toDateString() ??
                null}
            </Text>
            <Text
              style={{
                fontSize: 23,
                color: Colors.foreground,
                fontFamily: 'RobotoSlab-Bold',
                marginTop: 5,
              }}>
              {item.name}
            </Text>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <Text
              style={{
                fontSize: 17,
                color: Colors.foreground,
                fontFamily: 'RobotoSlab-Bold',
                marginTop: 15,
              }}>
              {'Description'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.foreground,
                fontFamily: 'RobotoSlab-Regular',
                marginTop: 10,
              }}>
              {item.description ?? '- No description'}
            </Text>
            <View style={{marginTop: 15, flexDirection: 'row'}}>
              <View
                style={{
                  backgroundColor: Colors.darker,
                  padding: 5,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  marginRight: 5,
                  borderWidth: 1,
                  borderColor: Colors.pill,
                }}>
                <Text style={{color: Colors.foreground, fontSize: 13}}>
                  {'Sales: ' + item.num_sales}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.darker,
                  padding: 5,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  marginRight: 5,
                  borderWidth: 1,
                  borderColor: Colors.pill,
                }}>
                <Text style={{color: Colors.foreground, fontSize: 13}}>
                  {'Symbol: ' + item.asset_contract.symbol}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.darker,
                  padding: 5,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  marginRight: 5,
                  borderWidth: 1,
                  borderColor: Colors.pill,
                }}>
                <Text style={{color: Colors.foreground, fontSize: 13}}>
                  {'Total Supply: ' + (item.asset_contract.total_supply ?? '-')}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: Colors.foreground,
                fontFamily: 'RobotoSlab-Regular',
                marginTop: 15,
              }}>
              {item.asset_contract.description ?? '- No description'}
            </Text>
            <View style={{marginTop: 20}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#2081E2',
                  alignContent: 'flex-start',
                  alignSelf: 'flex-start',
                  paddingHorizontal: 10,
                  paddingRight: 15,
                  borderRadius: 5,
                }}
                onPress={() => openLink(item.permalink)}>
                <Image
                  style={{
                    height: 25,
                    width: 25,
                  }}
                  source={require('assets/opensea.png')}
                  resizeMode="contain"
                />
                <Text style={{color: 'white', fontSize: 13}}>OpenSea</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </View>
  );
};

export default NFTScreen;
