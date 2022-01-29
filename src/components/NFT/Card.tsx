import React from 'react';
import {View, Text, Image} from 'react-native';
import {Colors} from 'utils/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const NFTCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.push('NFTScreen', {item})}
      style={{
        marginHorizontal: 5,
        backgroundColor: Colors.card,
        marginBottom: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
      <Image
        style={{
          height: 150,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        resizeMode="cover"
        defaultSource={require('../../assets/no-nft.png')}
        source={{
          uri: item.image_url,
        }}
      />
      <View style={{padding: 10}}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 14,
            color: Colors.lighter,
            fontFamily: 'RobotoSlab-Regular',
          }}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(NFTCard);
