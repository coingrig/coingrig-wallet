/* eslint-disable react-native/no-inline-styles */
import {Loader} from 'components/loader';
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {formatTime, openLink} from 'utils';
import {ILogEvents, LogEvents} from 'utils/analytics';
import endpoints from 'utils/endpoints';
import {styles} from './styles';
import FastImage from 'react-native-fast-image';

export default function CryptoNewsScreen() {
  const [news, setNews] = React.useState([]);
  React.useEffect(() => {
    getTheNews();
    LogEvents(ILogEvents.SCREEN, 'CryptoNews');
  }, []);

  const getTheNews = async () => {
    var config = {
      method: 'get',
      responseType: 'text',
      url: endpoints.cryptoNews,
    };
    axios(config)
      .then(async response => {
        try {
          // const parsed = await rssParser.parse(response.data);
          setNews(response.data.Data);
        } catch (err) {}
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => openLink(item.url)}
        style={styles.itemCrypto}>
        <FastImage
          style={styles.listImg}
          source={{
            uri: item.imageurl,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <View style={{flex: 1}}>
          <Text style={styles.source}>{item.source_info.name}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.published}>{formatTime(item.published_on)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const listFooter = () => {
    return (
      <View style={{margin: 15}}>
        <Text
          style={[
            styles.published,
            {fontSize: 10, textAlign: 'center', margin: 0},
          ]}>
          Powered by CryptoCompare
        </Text>
      </View>
    );
  };

  const preRender = () => {
    if (news.length === 0) {
      return Loader();
    } else {
      return (
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          maxToRenderPerBatch={5}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          style={{paddingTop: 5}}
          contentContainerStyle={{paddingBottom: 50}}
          ListFooterComponent={listFooter()}
        />
      );
    }
  };

  return <View style={{flex: 1}}>{preRender()}</View>;
}
