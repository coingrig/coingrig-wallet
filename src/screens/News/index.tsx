import {Loader} from 'components/loader';
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, Linking} from 'react-native';
import FastImage from 'react-native-fast-image';
import InAppBrowser from 'react-native-inappbrowser-reborn';
var axios = require('axios');
import * as rssParser from 'react-native-rss-parser';
import endpoints from 'utils/endpoints';
import {styles} from './styles';

export default function NewsScreen() {
  const [news, setNews] = React.useState([]);
  React.useEffect(() => {
    getTheNews();
  }, []);

  const getTheNews = async () => {
    var config = {
      method: 'get',
      responseType: 'text',
      url: endpoints.news,
    };
    axios(config)
      .then(async response => {
        try {
          const parsed = await rssParser.parse(response.data);
          setNews(parsed.items);
        } catch (err) {}
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const openLink = async url => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          readerMode: true,
          animated: true,
          modalPresentationStyle: 'automatic',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({item}) => {
    const splitTitle = item.title.split('- ');
    return (
      <TouchableOpacity
        onPress={() => openLink(item.links[0].url)}
        style={styles.item}>
        <Text style={styles.source}>{splitTitle[splitTitle.length - 1]}</Text>
        <Text style={styles.title}>{splitTitle[splitTitle.length - 2]}</Text>
        <Text style={styles.published}>{item.published}</Text>
      </TouchableOpacity>
    );
  };

  const listHeader = () => {
    return (
      <View style={{flex: 1, marginHorizontal: 0, marginBottom: 0}}>
        <FastImage
          source={require('../../assets/hub/news.png')}
          resizeMode="contain"
          style={{
            height: 220,
            width: '100%',
          }}
        />
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
          style={{paddingTop: 0}}
          ListHeaderComponent={listHeader()}
        />
      );
    }
  };

  return <View style={{flex: 1}}>{preRender()}</View>;
}
