/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BigList from 'react-native-big-list';
import {useNavigation} from '@react-navigation/native';
import {Colors} from 'utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';

import StockService from 'services/stocks';
import {useTranslation} from 'react-i18next';
import {styles} from './styles';
import debounce from 'lodash.debounce';
import {ILogEvents, LogEvents} from 'utils/analytics';
import {Logs} from 'services/logs';

const SearchStocks = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const {t} = useTranslation();

  const debouncedSearch = debounce(async text => {
    if (text.length === 0) {
      setData([]);
      return;
    }
    const query = await StockService.search(text);
    setData(query);
  }, 300);

  const searchStock = async text => {
    debouncedSearch(text);
  };

  const getData = () => {
    return data;
  };

  const addStock = async item => {
    Alert.alert(item.symbol, t('portfolio.stocks.add_confirmation'), [
      {
        text: t('settings.cancel'),
        onPress: () => Logs.info('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: t('settings.yes'),
        onPress: async () => {
          const stockData = await StockService.getStocks(item.symbol);
          if (stockData[0]) {
            StockService.add({
              id: item.symbol,
              symbol: item.symbol,
              name: item.name,
              price: stockData[0].price,
              qty: 0,
              change: stockData[0].changePercentage,
            });
            LogEvents(ILogEvents.ACTION, 'AddStock');
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <Text
          style={{
            color: Colors.lighter,
            marginHorizontal: 20,
            textAlign: 'center',
            fontSize: 13,
          }}>
          {t('portfolio.stocks.add_description')}
        </Text>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => addStock(item)} style={styles.item}>
        <View style={styles.itemContent}>
          <View style={{marginRight: 10}}>
            <Icon name="add-circle" size={30} color={Colors.green} />
          </View>
          <View>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.symbol}
            </Text>
            <Text style={styles.subTitle} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <Text style={styles.itemSymbol} numberOfLines={1}>
            {item.type}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    return (
      <BigList
        data={getData()}
        renderItem={renderItem}
        itemHeight={60}
        insetBottom={30}
        insetTop={10}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        footerHeight={150}
        ListFooterComponent={renderFooter}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          autoFocus
          autoCorrect={false}
          placeholderTextColor={'gray'}
          onChangeText={text => searchStock(text)}
          placeholder={t('portfolio.stocks.add_search')}
        />

        <TouchableOpacity
          style={styles.close}
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

export default SearchStocks;
