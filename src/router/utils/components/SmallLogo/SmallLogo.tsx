import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import type {VFC} from 'react';
import {Colors} from 'utils/colors';
import {isTestnet} from '../IsTestnet';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 280 / 13,
    width: 279 / 13,
    tintColor: Colors.foreground,
    marginLeft: 3,
  },
});

export const SmallLogo: VFC = () => {
  return (
    <View style={styles.container}>
      <Image source={require('assets/logo_small.png')} style={styles.image} />
      {isTestnet()}
    </View>
  );
};
