/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {Colors} from 'utils/colors';

export const Loader = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={Colors.foreground} />
    </View>
  );
};
