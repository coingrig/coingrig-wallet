import React, {useEffect, useState} from 'react';
import {Text, View, Image} from 'react-native';
import CodeGenerator from 'react-native-smart-code';
import {useTranslation} from 'react-i18next';
import {styles} from './styles';
import Share from 'react-native-share';
import {BigButton} from 'components/bigButton';
import {Colors} from 'utils/colors';
import {CryptoService} from 'services/crypto';

export const ReceiveContainer = props => {
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
  }, [props.address]);

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
        <View style={styles.network}>
          <Text style={styles.networkTxt}>
            {t('wallet.network') +
              ': ' +
              CryptoService.getSupportedChainNamebyID(props.chain)}
          </Text>
        </View>
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
};
