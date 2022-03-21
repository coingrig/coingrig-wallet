import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import CEX_LIST from 'data/cex';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import CexService from 'services/cex';
import {Colors} from 'utils/colors';
import ActionSheet from 'react-native-actions-sheet';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {Logs} from 'services/logs';
import {CexStore} from 'stores/cexStore';
import {showMessage} from 'react-native-flash-message';
import {LoadingModal} from 'services/loading';

const actionCamera: React.RefObject<any> = createRef();

export default function CexDetails({route}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const item = CEX_LIST[route.params.data];
  const [apiKeyText, setApiKeyText] = useState('apiKey');
  const [secretText, setSecretText] = useState('secret');
  const [exists, setExists] = useState(false);

  useEffect(() => {
    try {
      if (CexStore.cexs.length > 0) {
        console.log(CexStore.cexs);
        const cexExists = CexStore.getCexById(item.id);
        if (cexExists) {
          setExists(true);
          setSecretText('*********************');
          setApiKeyText('*********************');
        }
      }
    } catch (error) {}
  }, []);

  const pasteApiKey = async () => {
    const clipboardKey = await Clipboard.getString();
    setApiKeyText(clipboardKey);
  };

  const pasteSecret = async () => {
    const clipboardKey = await Clipboard.getString();
    setSecretText(clipboardKey);
  };

  const onSuccess = async e => {
    let data = e.data;
    const {apiKey, secretKey} = JSON.parse(data);
    actionCamera.current?.setModalVisible(false);
    if (apiKey && secretKey) {
      setApiKeyText(apiKey);
      setSecretText(secretKey);
    }
  };

  const saveCex = async () => {
    LoadingModal.instance.current?.show();
    try {
      const saved = await CexService.saveCexKeys(
        item.id,
        apiKeyText,
        secretText,
        item.title,
        item.icon,
      );
      if (saved) {
        console.log('Done');
        await CexService.getAllBalances();
        showMessage({
          message: t('Done'),
          type: 'success',
        });
        LoadingModal.instance.current?.hide();
        navigation.goBack();
      }
    } catch (error) {
      LoadingModal.instance.current?.hide();
      deleteCex(true);
      Logs.error(error);
      showMessage({
        message: t('Cannot authenticate'),
        type: 'danger',
      });
    }
  };

  const renderSaveOrQr = () => {
    if (apiKeyText.length > 10 && secretText.length > 10) {
      return (
        <TouchableOpacity onPress={saveCex} style={styles.fab2}>
          <Text>Save</Text>
        </TouchableOpacity>
      );
    } else {
      if (!item.qr) {
        return null;
      }
      return (
        <TouchableOpacity
          onPress={() => actionCamera.current?.setModalVisible()}
          style={styles.fab}>
          <Icon3 name="qrcode-scan" size={25} color={'black'} />
        </TouchableOpacity>
      );
    }
  };

  const deleteCex = async reload => {
    CexService.deleteCex(item.id);
    if (!reload) {
      showMessage({
        message: t('CEX Deleted'),
        type: 'success',
      });
      navigation.goBack();
    }
  };

  const renderDelete = () => {
    return (
      <TouchableOpacity
        onPress={() => deleteCex(false)}
        style={[styles.fab, {backgroundColor: '#FF3C2F'}]}>
        <Icon2 name="trash-2" size={25} color={'white'} />
      </TouchableOpacity>
    );
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
      <View>
        <Text
          style={{
            color: Colors.lighter,
            marginHorizontal: 30,
            marginBottom: 10,
            fontSize: 13,
          }}>
          Paste the Keys or Scan the QR Code
        </Text>
        <View
          style={{
            backgroundColor: Colors.card,
            marginHorizontal: 15,
            paddingHorizontal: 15,
            borderRadius: 10,
            marginBottom: 5,
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 55,
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomColor: Colors.border,
            }}>
            <Text
              style={{flex: 1, color: Colors.foreground, marginRight: 25}}
              numberOfLines={1}>
              {apiKeyText}
            </Text>
            {!exists ? (
              <TouchableOpacity onPress={pasteApiKey}>
                <Text style={{color: '#027AFE'}}>PASTE</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View
            style={{
              height: 55,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{flex: 1, color: Colors.foreground, marginRight: 25}}
              numberOfLines={1}>
              {secretText}
            </Text>
            {!exists ? (
              <TouchableOpacity onPress={pasteSecret}>
                <Text style={{color: '#027AFE'}}>PASTE</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.card,
            marginHorizontal: 15,
            paddingHorizontal: 15,
            height: 55,
            borderRadius: 10,
            marginVertical: 15,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{color: Colors.foreground}}>
            Where I find the API Keys ?
          </Text>
          <Icon2 name="external-link" size={20} color="gray" />
        </TouchableOpacity>
        <Text
          style={{color: Colors.lighter, marginHorizontal: 20, fontSize: 13}}>
          IMPORTANT: The keys have the permission to ONLY read your balance.
          Your keys remains on your phone in an encrypted storage.
        </Text>
      </View>
      {exists ? renderDelete() : renderSaveOrQr()}
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
