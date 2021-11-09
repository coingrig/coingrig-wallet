import React from 'react';
import {Image, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Colors} from 'utils/colors';

export function CoinsAvatar(props: any) {
  if (props.coin !== '_END_') {
    return (
      <FastImage
        style={props.style}
        source={{
          uri: props.source,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
      />
    );
  } else {
    return (
      <Text style={{fontSize: 30, fontWeight: 'bold', color: Colors.black}}>
        ?
      </Text>
    );
  }
}
