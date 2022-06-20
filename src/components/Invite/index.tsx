/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import {SmallButton} from 'components/smallButton';
import {SIZE} from 'utils/constants';
import {WalletStore} from 'stores/wallet';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {openLink} from 'utils';
import {ILogEvents, LogEvents} from 'utils/analytics';

export default function InviteScreen() {
  const navigation = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {
    LogEvents(ILogEvents.SCREEN, 'Invite');
  }, []);

  const shareAddress = async () => {
    await Share.open({
      title: '',
      message:
        'https://coingrig.com/invite?ref=' +
        WalletStore.getWalletAddressByChain('ETH'),
    });
    LogEvents(ILogEvents.CLICK, 'ShareReferral');
  };

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <View
        style={{
          backgroundColor: Colors.darker,
          borderRadius: 10,
          padding: 10,
          paddingVertical: 15,
          justifyContent: 'center',
          marginBottom: 20,
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
          {t('referral.earn_up_to')}{' '}
          <Text style={{color: 'orange'}}>$1000</Text>{' '}
          {t('referral.earn_from_friend')}
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
              fontSize: 14,
              color: Colors.lighter,
              textAlign: 'center',
            }}>
            {t('referral.info1')}
          </Text>
        </View>
        <View style={{margin: 5, marginVertical: 10}}>
          <Text
            style={{
              fontSize: 14,
              color: Colors.lighter,
              textAlign: 'center',
            }}>
            {t('referral.info2')}
          </Text>
        </View>
        <View style={{margin: 5, marginVertical: 10}}>
          <Text
            style={{
              fontSize: 14,
              color: Colors.lighter,
              textAlign: 'center',
            }}>
            {t('referral.info3')}
          </Text>
        </View>
      </View>
      <View>
        <SmallButton
          onPress={shareAddress}
          text={t('referral.share_btn')}
          color={Colors.background}
          style={{
            backgroundColor: Colors.foreground,
            borderColor: Colors.foreground,
            borderWidth: 3,
          }}
        />

        <SmallButton
          onPress={() =>
            navigation.navigate('ReferralHistory', {referal: true})
          }
          text={t('history.referral.title')}
          color={Colors.foreground}
          style={{
            backgroundColor: Colors.background,
            borderColor: Colors.foreground,
            borderWidth: 1,
          }}
        />
        <Text
          onPress={() =>
            openLink(
              'https://docs.coingrig.com/other/referral-system-terms-and-conditions',
            )
          }
          style={{
            fontSize: 13,
            textAlign: 'center',
            marginVertical: 10,
            color: Colors.lighter,
          }}>
          {t('referral.toc')}
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
          uri: 'https://assets.coingrig.com/images/gift.png',
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
      />
    </ScrollView>
  );
}
