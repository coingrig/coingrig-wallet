import React, {useEffect, useState} from 'react';
import {Text, View, Image} from 'react-native';
import CodeGenerator from 'react-native-smart-code';
import {useTranslation} from 'react-i18next';
import {styles} from './styles';
import Share from 'react-native-share';
import {BigButton} from 'components/bigButton';
import {Colors} from 'utils/colors';

export function ReceiveContainer(props) {
  const [imageUri, setImageUri] = useState<any>(null);
  const {t} = useTranslation();

  useEffect(() => {
    CodeGenerator.generate({
      type: CodeGenerator.Type.QRCode,
      code: props.address,
    })
      .then(response => {
        setImageUri(response);
      })
      .catch(err => console.log('Cannot create QR code', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareAddress = async () => {
    await Share.open({
      title: '',
      message: props.address,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.qrcontainer}>
        <Image
          source={{uri: imageUri}}
          resizeMode="stretch"
          style={styles.qr}
        />
        <Text
          style={styles.address}
          adjustsFontSizeToFit
          numberOfLines={2}
          selectable>
          {props.address}
        </Text>
      </View>
      <View style={styles.share}>
        <BigButton
          text={t('tx.share_address')}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          onPress={() => shareAddress()}
        />
      </View>
    </View>
  );
}
