import React from 'react';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
        <Icon name="wallet" size={20} />
      </Text>
    );
  }
}
