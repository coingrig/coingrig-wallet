import React from 'react';
import {
  View,
  Image,
  DeviceEventEmitter,
  Text,
  ActivityIndicator,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import {Colors} from 'utils/colors';
import {styles} from './styles';

function Door() {
  const [show, setShow] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const tc = React.useRef(null);
  const bc = React.useRef(null);
  React.useEffect(() => {
    const showListener = DeviceEventEmitter.addListener('showDoor', message => {
      setShow(true);
      setRunning(true);
    });
    const hideListener = DeviceEventEmitter.addListener('hideDoor', () => {
      setShow(false);
      try {
        //@ts-ignore
        tc.current.bounceInDown();
        //@ts-ignore
        bc.current.bounceInUp().then(endState => {
          if (endState.finished) {
            setRunning(false);
          }
        });
      } catch (error) {}
    });
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  if (!running && !show) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <Animatable.View
          ref={tc}
          delay={100}
          useNativeDriver
          // onAnimationEnd={e => (e.finished ? setShow(false) : null)}
          animation="bounceInDown"
          direction={show ? 'normal' : 'reverse'}
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
                opacity: 0.7,
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
              fill={'#1c1b1b'}
              opacity="0.9"
            />
          </Svg>
          <Svg
            viewBox="0 0 400 150"
            preserveAspectRatio="none"
            style={[styles.waves, {transform: [{rotate: '180deg'}]}]}>
            <Path
              d="M0 40.98c149.99 100.02 349.2-59.96 500 0V150H0z"
              fill={Colors.door}
              // opacity="0.7"
            />
          </Svg>
        </Animatable.View>
        <Animatable.View
          ref={bc}
          delay={100}
          animation="bounceInUp"
          useNativeDriver
          direction={show ? 'normal' : 'reverse'}
          style={{
            width: '100%',
            height: '110%',
            position: 'absolute',
            bottom: -80,
            transform: [{scaleX: 1}],
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignSelf: 'center',
              marginBottom: 150,
              marginHorizontal: 30,
            }}>
            <ActivityIndicator size="small" color="#e0e0e0" />
            <Text
              style={{
                color: '#e0e0e0',
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold',
                marginTop: 20,
              }}>
              Please wait
            </Text>
            <Text
              style={{
                color: '#c2c2c2',
                fontSize: 16,
                textAlign: 'center',
                marginTop: 20,
              }}>
              Lorem ipsum ala bala portocala ala bala portocoala
            </Text>
          </View>
          <Svg
            viewBox="0 0 400 150"
            preserveAspectRatio="none"
            style={styles.waves}>
            <Path
              d="M0 79.298c9.199 40.02 449.2-99.96 500 0V150H0z"
              fill={'#1c1b1b'}
              // opacity="0.5"
            />
          </Svg>
          <Svg
            viewBox="0 0 400 150"
            preserveAspectRatio="none"
            style={styles.waves2}>
            <Path
              d="M0 79.298c9.199 40.02 449.2-99.96 500 0V150H0z"
              fill={Colors.door}
              // opacity="0.7"
            />
          </Svg>
        </Animatable.View>
      </View>
    );
  }
}

export default React.memo(Door);
