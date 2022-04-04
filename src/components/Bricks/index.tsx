import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {formatPrice} from 'utils';
import {Colors} from 'utils/colors';
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
            numberOfLines={2}
            style={[styles.coinName, {color: Colors.background}]}>
            {t('portfolio.categories.other')}
          </Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.endBrick}>
            {formatPrice(props.value, true) || 0}
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
      onPress={() => navigation.navigate('PortfolioScreen', {tab: props.tab})}>
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
            <Icon name={props.icon} size={props.size} color={props.color} />
          </View>
        </View>
        <View style={styles.bcontainer}>{renderBody()}</View>
      </View>
      <Svg viewBox="0 0 400 150" preserveAspectRatio="none" style={styles.svg}>
        <Path
          d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
          fill={Colors.background}
          opacity={props.title === '_END_' ? 0.05 : 0.3}
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default React.memo(Brick);
