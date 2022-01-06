import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import type {VFC} from 'react';
import {Colors} from 'utils/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: inverse => ({
    height: 280 / 13,
    width: 279 / 13,
    tintColor: inverse ? Colors.foreground : Colors.background,
    marginLeft: 3,
  }),
});

export const TabLogo: VFC = (inverse = false) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('assets/logo_small.png')}
        style={styles.image(inverse)}
      />
    </View>
  );
};
