import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {VFC} from 'react';
import CONFIG from 'config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d9534f',
    padding: 5,
    borderRadius: 5,
    marginLeft: 15,
  },
  text: {
    color: 'white',
    fontSize: 10,
  },
});

export const isTestnet: VFC = () => {
  if (!CONFIG.TESTNET) {
    return;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text} />
    </View>
  );
};
