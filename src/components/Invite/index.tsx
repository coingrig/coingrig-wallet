/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import {SmallButton} from 'components/smallButton';

export default function InviteScreen() {
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
          Earn up to $1000 from each friend you invite
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
          onPress={() => null}
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
          width: 350,
          height: 350,
          position: 'absolute',
          right: -150,
          bottom: -100,
          opacity: 0.15,
        }}
        source={{
          uri: 'https://cdn-icons.flaticon.com/png/512/3620/premium/3620659.png?token=exp=1654193770~hmac=6f0b0b30a5e5437b34f28c56da7b42c2',
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
      />
    </ScrollView>
  );
}
