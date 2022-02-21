import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React, {createRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import CEX_LIST from 'data/cex';
import {useNavigation} from '@react-navigation/native';
import CexService from 'services/cex';
import {Colors} from 'utils/colors';
import ActionSheet from 'react-native-actions-sheet';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {Logs} from 'services/logs';
import {CexStore} from 'stores/cexStore';

const actionCamera: React.RefObject<any> = createRef();

export default function CexDetails({route}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const item = CEX_LIST[route.params.data];

  useEffect(() => {
    // try {
    //   console.log(CexStore.cexs[0].data);
    // } catch (error) {}
  }, []);

  const onSuccess = async e => {
    let data = e.data;
    const {apiKey, secretKey} = JSON.parse(data);
    console.log(apiKey, secretKey);
    actionCamera.current?.setModalVisible(false);
    if (apiKey && secretKey) {
      await CexService.saveCexKeys(item.id, apiKey, secretKey, item.title);
    }
  };

  return (
    <ScrollView
      style={styles.scrollviewDetails}
      alwaysBounceVertical={false}
      contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: Platform.OS === 'android' ? 15 : 50,
            zIndex: 2,
            backgroundColor: Colors.background,
            marginLeft: 12,
            borderRadius: 50,
            padding: 5,
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
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
      <TouchableOpacity
        onPress={() => actionCamera.current?.setModalVisible()}
        style={styles.fab}>
        <Icon2 name="qrcode-scan" size={25} color={'black'} />
      </TouchableOpacity>
      <ActionSheet
        //@ts-ignore
        ref={actionCamera}
        gestureEnabled={true}
        headerAlwaysVisible
        containerStyle={styles.cameracontainer}>
        <QRCodeScanner
          onRead={onSuccess}
          //@ts-ignore
          cameraContainerStyle={{margin: 20}}
          flashMode={RNCamera.Constants.FlashMode.auto}
        />
      </ActionSheet>
    </ScrollView>
  );
}
