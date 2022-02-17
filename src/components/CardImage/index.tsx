import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from 'utils/colors';

export default function CardImage({imageURI, category, title, desc}) {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <TouchableOpacity
      onPress={() => null}
      style={{
        backgroundColor: Colors.card,
        borderRadius: 10,
        minHeight: 20,
        marginBottom: 20,
      }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          zIndex: 10,
          top: open ? 185 : 5,
          right: 5,
          backgroundColor: Colors.darker,
          padding: 5,
          borderRadius: 100,
          borderWidth: 0.5,
          borderColor: Colors.lighter,
        }}
        onPress={() => setOpen(!open)}>
        <Icon name="arrow-collapse" size={18} color={Colors.foreground} />
      </TouchableOpacity>
      {open ? (
        <FastImage
          source={{
            uri: imageURI,
          }}
          resizeMode="cover"
          style={{
            height: 200,
            width: '100%',
            justifyContent: 'center',
            alignSelf: 'center',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}
        />
      ) : null}
      <View style={{margin: 15}}>
        <Text style={{color: Colors.lighter, marginBottom: 3}}>{category}</Text>
        <Text
          style={{
            color: Colors.foreground,
            fontSize: 22,
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
        <Text
          style={{
            color: Colors.lighter,
            fontSize: 13,
            marginTop: 4,
          }}>
          {desc}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
