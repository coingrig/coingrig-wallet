/* eslint-disable react-native/no-inline-styles */
import {Loader} from 'components/loader';
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import axios from 'axios';
import * as rssParser from 'react-native-rss-parser';
import {openLink} from 'utils';
import {ILogEvents, LogEvents} from 'utils/analytics';
import endpoints from 'utils/endpoints';
import {styles} from './styles';

export default function StockNewsScreen() {
  const [news, setNews] = React.useState([]);
  React.useEffect(() => {
    getTheNews();
    LogEvents(ILogEvents.SCREEN, 'StockNews');
  }, []);

  const getTheNews = async () => {
    var config = {
      method: 'get',
      responseType: 'text',
      url: endpoints.stockNews,
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
        />
      );
    }
  };

  return <View style={{flex: 1}}>{preRender()}</View>;
}
