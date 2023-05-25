/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  DeviceEventEmitter,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import BanksService from 'services/banks';
import {Colors} from 'utils/colors';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Logs} from 'services/logs';
import {useNavigation} from '@react-navigation/native';
import {LoadingModal} from 'services/loading';
import {sleep} from 'utils';
import {ILogEvents, LogEvents} from 'utils/analytics';
import Config from '../../config';

let accData: any = null;

export default function AddBank({route}) {
  const navigation = useNavigation();
  const [banks, setBanks] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // get banks
    const listenBrowserEvent = DeviceEventEmitter.addListener(
      'closeBrowser',
      () => {
        InAppBrowser.close();
        setupAccounts();
      },
    );
    getBanks();
    LogEvents(ILogEvents.SCREEN, 'AddBank');
    return () => {
      listenBrowserEvent.remove();
    };
  }, []);

  const openLink = async url => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const browser = await InAppBrowser.open(url, {
          dismissButtonStyle: 'cancel',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'automatic',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
          forceCloseOnRedirection: false,
        });
        if (browser.type === 'cancel') {
          LoadingModal.instance.current?.hide();
        }
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Logs.error(error);
    }
  };

  const getBanks = async () => {
    const list = await BanksService.getBanks(route.params.item.code);
    setBanks(list);
  };

  const setupBank = async item => {
    if (loading) {
      return;
    }
    LoadingModal.instance.current?.show();
    accData = null;
    setLoading(true);
    try {
      const bankID = Config.BANKING_SANDBOX
        ? 'SANDBOXFINANCE_SFIN0000'
        : item.id;
      const aggrement = await BanksService.getAggrement(bankID);
      const buildLink = await BanksService.createAuthLink(bankID, aggrement.id);
      accData = {aggrement, buildLink, item};
      await sleep(300);
      openLink(buildLink.link);
      setLoading(false);
    } catch (error) {
      Logs.error(error);
      LoadingModal.instance.current?.hide();
      setLoading(false);
    }
  };

  const setupAccounts = async () => {
    try {
      const accounts = await BanksService.fetchAccountsList(
        accData.buildLink.id,
      );
      const accountsIDs = accounts.accounts || [];
      if (accountsIDs.length > 0) {
        for (let index = 0; index < accountsIDs.length; index++) {
          const id = accountsIDs[index];
          await BanksService.createAccount(id, accData);
        }

        accData = null;
        BanksService.updateTotalBalance();
        LoadingModal.instance.current?.hide();
        // show message
        LogEvents(ILogEvents.ACTION, 'AddBank');
        navigation.goBack();
      } else {
        // alert no accounts or no permissions
        LoadingModal.instance.current?.hide();
      }
    } catch (error) {
      //alert error
      Logs.error(error);
      LoadingModal.instance.current?.hide();
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => setupBank(item)}
        style={{
          flexDirection: 'row',
          paddingVertical: 20,
          alignItems: 'center',
        }}>
        <FastImage
          style={{
            width: 30,
            height: 30,
            backgroundColor: 'white',
            borderRadius: 100,
            padding: 10,
          }}
          resizeMode="contain"
          source={{
            uri: item.logo,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <Text style={{marginHorizontal: 10, flex: 1, color: Colors.foreground}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={banks}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => (
        <View style={{height: 1, backgroundColor: Colors.border}} />
      )}
      style={{
        paddingHorizontal: 16,
      }}
      ListHeaderComponent={null}
      ListFooterComponent={() => <View style={{height: 30}} />}
    />
  );
}
