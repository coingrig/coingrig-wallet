import {TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';

export default function CardImageSmall({imageURI, onClick}) {
  return (
    <TouchableOpacity onPress={onClick} style={styles.container}>
      <FastImage
        source={{
          uri: imageURI,
        }}
        resizeMode="cover"
        style={styles.imageSmall}
      />
    </TouchableOpacity>
  );
}
