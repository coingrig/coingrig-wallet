/* eslint-disable react-hooks/exhaustive-deps */
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
const coins = require('../../assets/tokens.json');

const SearchScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(coins);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {}, []);

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

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CoinDetailScreen', {
            coin: item.id,
            title: item.symbol,
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
            style={{color: Colors.foreground, marginLeft: 10, fontSize: 17}}>
            {item.name}
          </Text>
          <Text style={{color: Colors.lighter, marginLeft: 10, fontSize: 13}}>
            {item.symbol}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
            fontSize: 17,
            backgroundColor: Colors.brick,
            paddingHorizontal: 10,
            height: 40,
            borderRadius: 5,
            color: Colors.foreground,
          }}
          // autoFocus
          autoCorrect={false}
          placeholderTextColor={'gray'}
          onChangeText={text => searchCoin(text)}
          // value={"text"}
          placeholder={'Coin Search'}
        />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: Colors.foreground}}>Close</Text>
        </View>
      </View>
      <View style={{flex: 1, marginHorizontal: 15}}>
        <BigList
          data={data}
          renderItem={renderItem}
          itemHeight={60}
          insetBottom={30}
          insetTop={20}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    // marginHorizontal: 20,
  },
});

export default SearchScreen;
