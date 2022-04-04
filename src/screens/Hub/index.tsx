/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import {ScrollView} from 'react-native-gesture-handler';
import HubCatgories from '../../data/categories';
import {useNavigation} from '@react-navigation/native';
import {SmallLogo} from 'routes';
import {ILogEvents, LogEvents} from 'utils/analytics';

const HubScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const scrollRef: any = useRef();
  const [screen, setScreen] = useState(HubCatgories[0]);
  const [shadowHeader, setShadowHeader] = useState(false);
  const flatListRef = React.useRef();

  useEffect(() => {
    LogEvents(ILogEvents.SCREEN, 'Hub/' + screen.title);
  }, []);

  useEffect(() => {
    if (shadowHeader) {
      navigation.setOptions({
        headerTitle: () => (
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'RobotoSlab-Bold',
              color: Colors.foreground,
            }}>
            {t('hub.title')}
          </Text>
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: () => <SmallLogo />,
      });
    }
  }, [navigation, shadowHeader, t]);

  const bubble = (item, index) => {
    return (
      <TouchableOpacity
        key={item.title}
        onPress={() => {
          setScreen(item);
          scrollRef.current?.scrollTo({
            x: index * 70,
            animated: true,
          });
          flatListRef.current?.scrollToIndex({animated: false, index: 0});
          LogEvents(ILogEvents.SCREEN, 'Hub/' + item.title);
        }}
        style={{
          backgroundColor:
            screen.title === item.title ? Colors.foreground : Colors.bubble,
          flex: 1,
          padding: 5,
          paddingHorizontal: 15,
          borderRadius: 15,
          marginHorizontal: 3,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          minWidth: 70,
        }}>
        <Text
          style={{
            fontSize: 14,
            color:
              screen.title === item.title ? Colors.background : Colors.lighter,
          }}>
          {t(item.description)}
        </Text>
      </TouchableOpacity>
    );
  };

  const header = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.title}>{t('hub.title')} </Text>
      </View>
    );
  };

  const menu = () => {
    return (
      <View style={shadowHeader ? styles.headerShadow : styles.headerNoShadow}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingRight: 20}}
          style={{
            paddingTop: 10,
            paddingHorizontal: 12,
            paddingBottom: 10,
          }}>
          {HubCatgories.map((item, index) => bubble(item, index))}
        </ScrollView>
      </View>
    );
  };

  const onScroll = y => {
    if (y > 55) {
      if (!shadowHeader) {
        setShadowHeader(true);
      }
    } else if (y < 55) {
      if (shadowHeader) {
        setShadowHeader(false);
      }
    }
  };

  const renderItem = ({index}) => {
    if (index === 0) {
      return header();
    }
    if (index === 1) {
      return menu();
    }
    if (index === 2) {
      return <screen.component />;
    }
    return null;
  };

  return (
    <FlatList
      data={[1, 2, 3]}
      ref={flatListRef}
      renderItem={renderItem}
      contentContainerStyle={{flexGrow: 1}}
      style={styles.container}
      stickyHeaderIndices={[1]}
      scrollEventThrottle={200}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item: any, index) => index.toString() ?? ''}
      onScroll={e => onScroll(e.nativeEvent.contentOffset.y)}
    />
  );
};

export default HubScreen;
