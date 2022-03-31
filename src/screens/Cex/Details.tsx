/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
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
import {openLink} from 'utils';
import {ILogEvents, LogEvents} from 'utils/analytics';

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
    const data = e.data;
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
        await CexService.getBalance(item.id);
        CexStore.updateTotalBalance(CexStore.sumTotalBalance());
        showMessage({
          message: t('Done'),
          type: 'success',
        });
        LoadingModal.instance.current?.hide();
        LogEvents(ILogEvents.ACTION, 'AddCex');
        navigation.goBack();
      }
    } catch (error) {
      LoadingModal.instance.current?.hide();
      deleteCex(true);
      if (error !== 'Authorization error') {
        Logs.error(error);
        showMessage({
          message: t('Cannot authenticate'),
          type: 'danger',
        });
      }
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
    CexService.getAllBalances();
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
          style={styles.back}
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
            {'Connector'}
          </Text>
          <Text style={styles.title}>{'Connect to' + ' ' + item.title}</Text>
          {/* <Text style={styles.desc}>{'Track your assets'}</Text> */}
        </View>
      </View>
      <View>
        <Text style={styles.pastedesc}>
          {t('Paste the Keys or Scan the QR Code')}
        </Text>
        <View style={styles.containercard}>
          <View style={styles.key}>
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
          <View style={styles.secret}>
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
          onPress={() => openLink(item.link)}
          style={styles.externalLink}>
          <Text style={{color: Colors.foreground}}>
            {t('Where I find the API Keys ?')}
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
