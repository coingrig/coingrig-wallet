import React from 'react';
import {Image, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BigButton} from '../../components/bigButton';
import {useTranslation} from 'react-i18next';
import {Colors} from 'utils/colors';
import {styles} from './styles';
import Svg, {Path} from 'react-native-svg';

const StartScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View>
          <Image
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 75, tintColor: Colors.foreground}}
            resizeMode="contain"
            source={require('../../assets/logo.png')}
          />
        </View>
        <Text style={[styles.logo, {color: Colors.foreground}]}>coingrig</Text>
        {/* <Text style={[styles.subtitle, {color: Colors.lighter}]}>
          {t('brand.message')}
        </Text> */}
      </View>
      <View style={styles.bottomContainer}>
        <BigButton
          text={t('init.new_wallet')}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          //@ts-ignore
          onPress={() => navigation.navigate('SetPinScreen', {new: true})}
        />
        <BigButton
          text={t('init.import_wallet')}
          backgroundColor={Colors.background}
          color={Colors.foreground}
          //@ts-ignore
          onPress={() => navigation.navigate('SetPinScreen', {new: false})}
        />
      </View>
      <Svg
        viewBox="0 0 400 150"
        preserveAspectRatio="none"
        style={styles.waves}>
        <Path
          d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
          fill={Colors.waveborder}
          opacity="0.9"
        />
      </Svg>
      <Svg
        viewBox="0 0 400 150"
        preserveAspectRatio="none"
        style={styles.waves2}>
        <Path
          d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
          fill={Colors.darker}
          // opacity="0.7"
        />
      </Svg>
    </View>
  );
};

export default StartScreen;
