import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from 'utils/colors';
import BanksService from 'services/banks';

export default function BankingScreen() {
  return (
    <View>
      <TouchableOpacity
        onPress={async () => {
          await BanksService.fetchAccountsList('');
          // await BanksService.getBanks('RO');
          // await BanksService.getAggrement('SANDBOXFINANCE_SFIN0000');
          // await BanksService.createAuthLink(
          //   'SANDBOXFINANCE_SFIN0000',
          //   '',
          // );
        }}
        style={{margin: 5, padding: 10, backgroundColor: Colors.card}}>
        <Text>Add bank</Text>
      </TouchableOpacity>
    </View>
  );
}
