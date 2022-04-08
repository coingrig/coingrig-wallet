/* eslint-disable react-native/no-inline-styles */
import {Text} from 'react-native';
import React from 'react';
import {Colors} from 'utils/colors';

export default function Separator({title}) {
  return (
    <Text
      style={{
        color: Colors.lighter,
        margin: 10,
        marginLeft: 16,
        fontSize: 13,
      }}>
      {title}
    </Text>
  );
}
