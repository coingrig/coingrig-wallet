import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {formatPrice} from 'utils';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';

const Brick = (props: any) => {
  const color = Colors.brick;
  const navigation = useNavigation();
  const {t} = useTranslation();

  const renderBody = () => {
    if (props.title !== '_END_') {
      return (
        <>
          <Text adjustsFontSizeToFit numberOfLines={2} style={styles.coinName}>
            {props.title}
          </Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.dollar}>
            {formatPrice(props.value, true) || 0}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[
              styles.coinName,
              // eslint-disable-next-line react-native/no-inline-styles
              {color: Colors.background, marginBottom: 10},
            ]}>
            {t('bricks.all_wallets')}
          </Text>
          <Text adjustsFontSizeToFit numberOfLines={2} style={styles.endBrick}>
            {t('bricks.check_portfolio')}
          </Text>
        </>
      );
    }
  };
  return (
    <TouchableOpacity
      style={[
        styles.brick,
        {
          backgroundColor: props.title === '_END_' ? Colors.brickEnd : color,
        },
      ]}
      onPress={() => navigation.navigate('PortfolioScreen')}>
      <View style={styles.container}>
        <View style={styles.tcontainer}>
          <View
            style={[
              styles.logo,
              {
                backgroundColor:
                  props.title === '_END_' ? Colors.brickEnd : Colors.background,
              },
            ]}>
            <Icon name={props.icon} size={32} color={props.color} />
          </View>
        </View>
        <View style={styles.bcontainer}>{renderBody()}</View>
      </View>
      <Svg viewBox="0 0 400 150" preserveAspectRatio="none" style={styles.svg}>
        <Path
          d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
          fill={Colors.wave}
          opacity="0.5"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default React.memo(Brick);
