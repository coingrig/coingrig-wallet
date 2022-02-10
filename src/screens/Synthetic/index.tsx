import {useNavigation} from '@react-navigation/native';
import {CoinsAvatar} from 'components/coinsAvatar';
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, Linking} from 'react-native';
import FastImage from 'react-native-fast-image';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import {Logs} from 'services/logs';
import {Colors} from 'utils/colors';
import {styles} from './styles';

const synthlist = [
  {
    cid: 'mirrored-tesla',
    title: 'Tesla',
    img: 'https://assets.coingrig.com/images/synth/tesla.png',
  },
  {
    cid: 'mirrored-google',
    title: 'Google',
    img: 'https://assets.coingrig.com/images/synth/google.png',
  },
  {
    cid: 'mirrored-microsoft',
    title: 'Microsoft',
    img: 'https://assets.coingrig.com/images/synth/microsoft.png',
  },
  {
    cid: 'mirrored-apple',
    title: 'Apple',
    img: 'https://assets.coingrig.com/images/synth/apple.png',
  },
  {
    cid: 'mirrored-ishares-silver-trust',
    title: 'iShares Silver',
    img: 'https://assets.coingrig.com/images/synth/silver.png',
  },
  {
    cid: 'mirrored-amazon',
    title: 'Amazon',
    img: 'https://assets.coingrig.com/images/synth/amazon.png',
  },
  {
    cid: 'mirrored-netflix',
    title: 'Netflix',
    img: 'https://assets.coingrig.com/images/synth/netflix.png',
  },
  {
    cid: 'mirrored-united-states-oil-fund',
    title: 'US OIL Fund',
    img: 'https://assets.coingrig.com/images/synth/oil.png',
  },
  {
    cid: 'mirrored-twitter',
    title: 'Twitter',
    img: 'https://assets.coingrig.com/images/synth/twitter.png',
  },
  {
    cid: 'mirrored-alibaba',
    title: 'Alibaba',
    img: 'https://assets.coingrig.com/images/synth/alibaba.png',
  },
  {
    cid: 'mirrored-ishares-gold-trust',
    title: 'iShares Gold',
    img: 'https://assets.coingrig.com/images/synth/gold.png',
  },
  {
    cid: 'mirrored-facebook',
    title: 'Facebook',
    img: 'https://assets.coingrig.com/images/synth/fb.png',
  },
  {
    cid: 'mirrored-invesco-qqq-trust',
    title: 'Invesco QQQ',
    img: 'https://assets.coingrig.com/images/synth/q.png',
  },
];

export default function SyntheticScreen() {
  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => openLink()} style={styles.moreBtn}>
          <Icon2 name="external-link" size={22} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const openLink = async () => {
    const url = 'https://docs.mirror.finance/';
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
          <Text style={styles.title}>{splitTitle[splitTitle.length - 1]}</Text>
        </View>
        <Icon name="arrow-forward" size={20} color="gray" />
      </TouchableOpacity>
    );
  };

  const listHeader = () => {
    return (
      <View style={{flex: 1, marginHorizontal: 0, marginBottom: 0}}>
        {/* <FastImage
          source={require('../../assets/hub/paper_large.png')}
          resizeMode="contain"
          style={{
            height: 130,
            width: '100%',
            marginVertical: 60,
          }}
        /> */}
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginHorizontal: 16,
            marginTop: 20,
          }}>
          <FastImage
            source={require('../../assets/hub/mirror.png')}
            resizeMode="contain"
            tintColor={Colors.lighter}
            style={{
              height: 40,
              width: 40,
            }}
          />
          <Text
            numberOfLines={3}
            adjustsFontSizeToFit
            style={{
              color: Colors.lighter,
              fontSize: 12,
              marginBottom: 16,
              marginHorizontal: 10,
              flex: 2,
            }}>
            Mimic the price behavior of real world assets without the burdens of
            owning or transacting real assets.
          </Text>
        </View>
      </View>
    );
  };

  const preRender = () => {
    return (
      <FlatList
        data={synthlist}
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
