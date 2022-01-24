import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BigList from 'react-native-big-list';
import {useNavigation} from '@react-navigation/native';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import {useTransitionEnd} from 'utils/hooks/useTransitionEnd';
import {useTranslation} from 'react-i18next';
import {Loader} from 'components/loader';
import {SmallButton} from 'components/smallButton';
const coins = require('../../assets/tokens.json');

const SearchScreen = ({route}) => {
  const navigation = useNavigation();
  const [data, setData] = useState(coins);
  const [showScreen, setShowScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const transitionEnded = useTransitionEnd(navigation);

  const {t} = useTranslation();

  useEffect(() => {
    if (transitionEnded) {
      setTimeout(() => {
        setShowScreen(true);
      }, 200);
    }
  }, [transitionEnded]);

  const searchCoin = text => {
    let coinsList = data;
    if (text.length === 0) {
      setData(coins);
      return;
    }
    if (text.length < searchText.length) {
      coinsList = coins;
    }
    setSearchText(text);
    const newData = coinsList.filter(item => {
      const itemData = `${item.name.toUpperCase()}
      ${item.symbol.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setData(newData);
  };

  const getData = () => {
    return data;
  };

  const renderFooter = () => {
    if (!route.params.onlySupported) {
      return null;
    } else {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <SmallButton
            text={t('search.add_asset')}
            onPress={() => navigation.navigate('CustomTokenScreen')}
            color={Colors.lighter}
            style={{
              backgroundColor: Colors.darker,
              borderWidth: 0,
            }}
          />
        </View>
      );
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CoinDetailScreen', {
            coin: item.id,
            title: item.symbol,
            isSupported: item.supported,
            showAdd: true,
          })
        }
        style={{
          flexDirection: 'row',
          flex: 1,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.brick,
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        <FastImage
          style={{
            width: 20,
            height: 20,
            marginRight: 0,
            justifyContent: 'center',
            alignSelf: 'center',
            marginVertical: 10,
          }}
          source={{
            uri: item.thumb,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              flex: 5,
              color: Colors.foreground,
              marginLeft: 10,
              fontSize: 17,
            }}
            numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            style={{
              flex: 1,
              color: Colors.lighter,
              marginLeft: 10,
              fontSize: 13,
              textAlign: 'right',
            }}
            numberOfLines={1}>
            {item.symbol.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    if (showScreen) {
      return (
        <BigList
          data={getData()}
          renderItem={renderItem}
          itemHeight={60}
          insetBottom={30}
          insetTop={10}
          keyboardDismissMode="on-drag"
          // batchSizeThreshold={1.5}
          showsVerticalScrollIndicator={false}
          footerHeight={150}
          ListFooterComponent={renderFooter}
        />
      );
    } else {
      return <Loader />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          paddingBottom: 20,
          borderBottomColor: Colors.brick,
          borderBottomWidth: 1,
          paddingHorizontal: 15,
        }}>
        <TextInput
          style={{
            flex: 4,
            fontSize: 16,
            borderWidth: 1,
            borderColor: Colors.brick,
            backgroundColor: Colors.card,
            paddingHorizontal: 10,
            height: 45,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            color: Colors.foreground,
          }}
          // autoFocus
          autoCorrect={false}
          placeholderTextColor={'gray'}
          onChangeText={text => searchCoin(text)}
          placeholder={t('search.search_assets')}
        />

        <TouchableOpacity
          style={{
            flex: 1.2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.brick,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          }}
          onPress={() => navigation.goBack()}>
          <Text style={{color: Colors.foreground, fontWeight: 'bold'}}>
            {t('settings.cancel')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, marginHorizontal: 15}}>{renderList()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
});

export default SearchScreen;
