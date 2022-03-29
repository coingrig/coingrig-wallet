/* eslint-disable react-hooks/exhaustive-deps */
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
import {useTranslation} from 'react-i18next';
import {ILogEvents, LogEvents} from 'utils/analytics';

export default function SyntheticScreen() {
  const navigation = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => openLink()} style={styles.moreBtn}>
          <Icon2 name="info" size={22} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    LogEvents(ILogEvents.SCREEN, 'Synthetics');
  }, []);

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
          <View style={styles.headerMirror}>
            <Text style={styles.headersubtitle}>Mirror Protocol Tokens</Text>
            <Text numberOfLines={3} adjustsFontSizeToFit style={styles.desc}>
              {t('synthetic.description')}
              <Text style={styles.powered}> Powered by Mirror Protocol.</Text>
            </Text>
          </View>
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
