/* eslint-disable react-native/no-inline-styles */
import {Text} from 'react-native';
import React from 'react';
import {Colors} from 'utils/colors';

export default function External() {
  return (
    <Text
      style={{
        color: Colors.lighter,
        margin: 10,
        marginLeft: 16,
        fontSize: 14,
      }}>
      EXTERNAL
    </Text>
  );
}
