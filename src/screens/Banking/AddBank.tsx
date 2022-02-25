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

let accData: any = null;

export default function AddBank({route}) {
  const navigation = useNavigation();
  const [banks, setBanks] = useState(null);
  const [loading, setLoading] = useState(false);
  //   const [accData, setAccData] = useState<any>({});

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
    return () => {
      listenBrowserEvent.remove();
    };
  }, []);

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
          enableDefaultShare: false,
          forceCloseOnRedirection: false,
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Logs.error(error);
    }
  };

  const getBanks = async () => {
    // console.log(route.params.item.code);
    const list = await BanksService.getBanks(route.params.item.code);
    setBanks(list);
  };

  const setupBank = async item => {
    if (loading) {
      return;
    }
    accData = null;
    setLoading(true);
    try {
      const idtest = 'SANDBOXFINANCE_SFIN0000';
      const aggrement = await BanksService.getAggrement(idtest);
      const buildLink = await BanksService.createAuthLink(idtest, aggrement.id);
      accData = {aggrement, buildLink, item};
      openLink(buildLink.link);
      setLoading(false);
    } catch (error) {
      Logs.error(error);
      setLoading(false);
    }
  };

  const setupAccounts = async () => {
    //
    // show loading spinner, please wait!!!
    //
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
        // show message
        navigation.goBack();
      } else {
        // alert no accounts or no permissions
      }
      //   console.log('----', accounts);
    } catch (error) {
      //alert error
      Logs.error(error);
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
          style={{width: 45, height: 30}}
          resizeMode="contain"
          source={{
            uri: item.logo,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <Text style={{marginHorizontal: 10, flex: 1}}>{item.name}</Text>
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
