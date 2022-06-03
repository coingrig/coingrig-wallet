/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import {SmallButton} from 'components/smallButton';
import {SIZE} from 'utils/constants';
import {WalletStore} from 'stores/wallet';

export default function InviteScreen() {
  const shareAddress = async () => {
    await Share.open({
      title: '',
      message:
        'https://coingrig.com/invite?ref=' +
        WalletStore.getWalletAddressByChain('ETH'),
    });
  };

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <View
        style={{
          backgroundColor: Colors.darker,
          borderRadius: 10,
          padding: 10,
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <Text
          style={{
            fontSize: 19,
            textAlign: 'center',
            fontWeight: 'bold',
            marginHorizontal: 45,
            color: Colors.foreground,
            // width: 280,
          }}>
          Earn up to <Text style={{color: 'orange'}}>$1000</Text> from each
          friend you invite
        </Text>

        <View
          style={{
            height: 10,
            borderBottomWidth: 1,
            borderColor: Colors.foreground,
            width: 60,
            marginVertical: 10,
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        />
        <View style={{margin: 5, marginVertical: 10}}>
          <Text
            style={{
              fontSize: 15,
              color: Colors.lighter,
              textAlign: 'center',
            }}>
            1. Send the invitation link to your friend
          </Text>
        </View>
        <View style={{margin: 5, marginVertical: 10}}>
          <Text
            style={{
              fontSize: 15,
              color: Colors.lighter,
              textAlign: 'center',
            }}>
            2. Your friend need to install and setup Coingrig app using your
            invitation link
          </Text>
        </View>
        <View style={{margin: 5, marginVertical: 10}}>
          <Text
            style={{
              fontSize: 15,
              color: Colors.lighter,
              textAlign: 'center',
            }}>
            3. For each in app Swap your friend make, you will directly receive
            0.5% of the swapped token on your wallet address
          </Text>
        </View>
      </View>
      <View>
        <SmallButton
          onPress={shareAddress}
          text="Share Invitation Link"
          color={Colors.background}
          style={{
            backgroundColor: Colors.foreground,
            borderColor: Colors.foreground,
            borderWidth: 3,
          }}
        />

        <SmallButton
          onPress={() => null}
          text="My Earnings"
          color={Colors.foreground}
          style={{
            backgroundColor: Colors.background,
            borderColor: Colors.foreground,
            borderWidth: 1,
          }}
        />
        <Text
          style={{
            fontSize: 13,
            textAlign: 'center',
            marginVertical: 10,
            color: Colors.lighter,
          }}>
          Terms & Conditions
        </Text>
      </View>
      <FastImage
        style={{
          width: SIZE.width - 70,
          height: SIZE.width - 70,
          position: 'absolute',
          right: 35,
          bottom: -100,
          opacity: 0.15,
        }}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/1139/1139982.png',
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
      />
    </ScrollView>
  );
}
