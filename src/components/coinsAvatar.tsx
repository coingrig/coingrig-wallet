import React from 'react';
import {Image, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Colors} from 'utils/colors';

export function CoinsAvatar(props: any) {
  if (props.source) {
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
  }
  if (props.coin === 'BTC') {
    return (
      <Image style={props.style} source={require('../assets/coins/btc.png')} />
    );
  } else if (props.coin === 'ETH') {
    return (
      <Image style={props.style} source={require('../assets/coins/eth.png')} />
    );
  } else if (props.coin === 'BNB') {
    return (
      <Image style={props.style} source={require('../assets/coins/bnb.png')} />
    );
  } else if (props.coin === 'DOGE') {
    return (
      <Image style={props.style} source={require('../assets/coins/doge.png')} />
    );
  } else if (props.coin === '_END_') {
    return (
      <Text style={{fontSize: 30, fontWeight: 'bold', color: Colors.black}}>
        ?
      </Text>
    );
  }
  return null;
}
