import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import CexService from 'services/cex';
import {Logs} from 'services/logs';

export default function CEXScreen() {
  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    const balance = await CexService.getBalance('binance');
    Logs.info(balance);
  };

  return (
    <View>
      <Text>index</Text>
    </View>
  );
}
