import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from 'utils/colors';
import {styles} from './styles';

export default function CardImage({imageURI, category, title, desc, onClick}) {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <TouchableOpacity onPress={onClick} style={styles.container}>
      <TouchableOpacity
        style={[styles.collapse, {top: open ? 185 : 5}]}
        onPress={() => setOpen(!open)}>
        <Icon name="arrow-collapse" size={18} color={Colors.foreground} />
      </TouchableOpacity>
      {open ? (
        <FastImage
          source={{
            uri: imageURI,
          }}
          resizeMode="cover"
          style={styles.image}
        />
      ) : null}
      <View style={{margin: 15}}>
        <Text style={{color: Colors.lighter, marginBottom: 3}}>{category}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </TouchableOpacity>
  );
}
