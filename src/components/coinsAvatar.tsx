import React from 'react';
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
    return <Icon name="wallet" size={20} color={Colors.black} />;
  }
}
