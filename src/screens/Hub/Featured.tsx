import {Linking, Platform, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import apps from '../../data/apps';
import {useTranslation} from 'react-i18next';
import CardList from 'components/CardList';
import CardImage from 'components/CardImage';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {ConfigStore} from 'stores/config';
import i18n from 'i18n/index';
import CONFIG from '../../config';
import {openLink} from 'utils';

export default function Featured() {
  const {t} = useTranslation();
  const defaultNews = {
    title: t('hub.featured.title'),
    description: t('hub.featured.description'),
    img: 'https://assets.coingrig.com/images/balance.png',
    action: {
      type: 'navigate',
      params: {
        screen: 'PortfolioScreen',
        options: {tab: 'Banks'},
      },
    },
  };
  const navigation = useNavigation();
  const [newsItem, setNewsItem] = useState(defaultNews);

  useEffect(() => {
    const buildNumber =
      Platform.OS === 'android'
        ? CONFIG.BUILD_NUMBER_ANDROID
        : CONFIG.BUILD_NUMBER_IOS;
    const getNewsItem = () => {
      let news = ConfigStore.getModuleProperty('discovery', 'items', []);
      // Find the first valid news item compatible with the app version
      news = news.filter(o => {
        return o.type === 'default' && buildNumber >= o.required_version;
      });
      news = news.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
      if (news.length === 0) {
        return null;
      }
      // Get first item
      const item = news[0];
      //
      return item.desc[i18n.language];
    };
    const i = getNewsItem();
    if (i) {
      setNewsItem(i);
    }
  }, []);

  const handleNewsAction = async newsItem => {
    const action = newsItem.action;
    try {
      if (action.type === 'url') {
        const url = action.params.url;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          return openLink(url);
        }
        return;
      }
      if (action.type === 'navigate') {
        return navigation.navigate(action.params.screen, action.params.options);
      }
    } catch (e) {
      // Nothing to do, bad action config
    }
    return;
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollview, {paddingTop: 10}]}>
      <CardImage
        //@ts-ignore
        onClick={() => {
          return handleNewsAction(newsItem);
        }}
        imageURI={newsItem.img}
        category={t('hub.featured').toUpperCase()}
        title={newsItem.title}
        desc={newsItem.description}
      />
      <CardList
        data={apps.filter(app => app.categories?.includes('featured'))}
        title={t('hub.shortcuts.description')}
        category={t('hub.shortcuts').toUpperCase()}
      />
    </ScrollView>
  );
}
