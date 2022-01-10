import React from 'react';
import {View, Image} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import {Colors} from 'utils/colors';
import {styles} from './styles';

export default function Door({count}) {
  if (!count) {
    return <></>;
  }
  return (
    <View style={styles.container}>
      <Animatable.View
        delay={500}
        animation="bounceInDown"
        direction="alternate"
        iterationCount={count}
        style={{
          height: '100%',
          marginTop: -40,
        }}>
        <View>
          <Image
            style={{
              height: 80,
              width: 80,
              tintColor: 'white',
              zIndex: 100,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 200,
              opacity: 0.8,
            }}
            resizeMode="contain"
            source={require('../../assets/logo.png')}
          />
        </View>
        <Svg
          viewBox="0 0 400 150"
          preserveAspectRatio="none"
          style={[styles.waves2, {transform: [{rotate: '180deg'}]}]}>
          <Path
            d="M0 49.98c149.99 100.02 349.2-59.96 500 0V150H0z"
            fill={'black'}
            opacity="0.9"
          />
        </Svg>
        <Svg
          viewBox="0 0 400 150"
          preserveAspectRatio="none"
          style={[styles.waves, {transform: [{rotate: '180deg'}]}]}>
          <Path
            d="M0 40.98c149.99 100.02 349.2-59.96 500 0V150H0z"
            fill="#353333"
            // opacity="0.7"
          />
        </Svg>
      </Animatable.View>
      <Animatable.View
        delay={500}
        animation="bounceInUp"
        direction="alternate"
        iterationCount={count}
        style={{
          width: '100%',
          height: '110%',
          position: 'absolute',
          bottom: -80,
          transform: [{scaleX: 1}],
        }}>
        <Svg
          viewBox="0 0 400 150"
          preserveAspectRatio="none"
          style={styles.waves}>
          <Path
            d="M0 79.298c9.199 40.02 449.2-99.96 500 0V150H0z"
            fill={'black'}
            opacity="0.4"
          />
        </Svg>
        <Svg
          viewBox="0 0 400 150"
          preserveAspectRatio="none"
          style={styles.waves2}>
          <Path
            d="M0 79.298c9.199 40.02 449.2-99.96 500 0V150H0z"
            fill="#353333"
            // opacity="0.7"
          />
        </Svg>
      </Animatable.View>
    </View>
  );
}
