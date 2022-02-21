import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from './styles';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import CEX_LIST from 'data/cex';
import {useNavigation} from '@react-navigation/native';
import {Colors} from 'utils/colors';

export default function CexDetails({route}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const item = CEX_LIST[route.params.data];
  return (
    <ScrollView style={styles.scrollviewDetails} alwaysBounceVertical={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 50,
            zIndex: 2,
            backgroundColor: Colors.background,
            marginLeft: 10,
            borderRadius: 50,
            padding: 5,
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={25} color={Colors.foreground} />
        </TouchableOpacity>
        <FastImage
          source={{uri: item.headerImage}}
          resizeMode="cover"
          style={styles.image}
        />
        <View style={{margin: 15}}>
          <Text style={{color: Colors.lighter, marginBottom: 3}}>
            {'category'}
          </Text>
          <Text style={styles.title}>{'title'}</Text>
          <Text style={styles.desc}>{'desc'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
