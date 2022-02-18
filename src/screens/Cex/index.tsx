import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import CexService from 'services/cex';
import {Logs} from 'services/logs';

export default function CEXScreen() {
  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    // console.log(CexService.exchanges);
    const balance = await CexService.getBalance('coinbase');
    Logs.info(balance);
  };

  return (
    <View>
      <Text>index</Text>
    </View>
  );
}
