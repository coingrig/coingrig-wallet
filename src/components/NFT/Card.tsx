import React from 'react';
import {View, Text, Image, Linking} from 'react-native';
import {Colors} from 'utils/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

export default function NFTCard({item}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.push('NFTScreen', {item})}
      style={{
        marginHorizontal: 15,
        marginTop: 5,
        backgroundColor: Colors.card,
        marginBottom: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
      <Image
        style={{
          height: 200,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        defaultSource={require('assets/no-image.png')}
        resizeMode="cover"
        source={{
          uri: item.image_url,
        }}
      />
      <View style={{padding: 10}}>
        <Text
          style={{
            fontSize: 16,
            color: Colors.foreground,
            fontFamily: 'RobotoSlab-Bold',
          }}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
