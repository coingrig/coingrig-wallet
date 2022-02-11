import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {CoinsAvatar} from 'components/coinsAvatar';
import {View, Text, FlatList, TouchableOpacity, Linking} from 'react-native';
import FastImage from 'react-native-fast-image';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import {Logs} from 'services/logs';
import {Colors} from 'utils/colors';
import {styles} from './styles';
import {SYNTH_LIST} from 'utils/constants';
import {generateMnemonic, generateWallet} from '@coingrig/wallet-generator';

export default function SyntheticScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => openLink()} style={styles.moreBtn}>
          <Icon2 name="info" size={22} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });

    test();
  }, []);

  const test = async () => {
    const words = 12; // or 24
    const mnemonic = await generateMnemonic(words);

    // Generate wallet
    const chain = 'BTC'; // or ETH
    let wallet = await generateWallet(mnemonic, chain);
    wallet = JSON.parse(wallet);
    console.log(wallet.address, wallet.privateKey);
  };

  const openLink = async () => {
    const url = 'https://docs.mirror.finance/faq';
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

  const renderItem = ({item}) => {
    const splitTitle = item.title.split('- ');
    return (
      <TouchableOpacity
        onPress={() => {
          //@ts-ignore
          navigation.navigate('CoinDetailScreen', {
            coin: item.cid,
            title: item.title,
            isSupported: true,
            showAdd: true,
            img: item.img,
          });
        }}
        style={styles.item}>
        <CoinsAvatar style={styles.logoimg} source={item.img} />
        <View style={{flex: 1}}>
          <Text style={styles.subtitle}>Mirrored</Text>
          <Text style={styles.title}>{splitTitle[splitTitle.length - 1]}</Text>
        </View>
        <Icon name="arrow-forward" size={20} color="gray" />
      </TouchableOpacity>
    );
  };

  const listHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headersub}>
          <FastImage
            source={require('../../assets/hub/mirror.png')}
            resizeMode="contain"
            tintColor={Colors.lighter}
            style={styles.mirrorimg}
          />
          <Text numberOfLines={3} adjustsFontSizeToFit style={styles.desc}>
            Mimic the price behavior of real world assets without the burdens of
            owning or transacting real assets. Powered by Mirror Protocol.
          </Text>
        </View>
      </View>
    );
  };

  const preRender = () => {
    return (
      <FlatList
        data={SYNTH_LIST}
        renderItem={renderItem}
        keyExtractor={item => item.cid}
        maxToRenderPerBatch={5}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        style={{paddingTop: 0}}
        ListHeaderComponent={listHeader()}
        ListFooterComponent={() => <View style={{height: 30}} />}
      />
    );
  };

  return <View style={{flex: 1}}>{preRender()}</View>;
}
