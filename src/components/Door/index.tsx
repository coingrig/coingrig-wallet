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

let DoorClose = false;

//TODO To improve/opt
function Door() {
  const [show, setShow] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [title, setTitle] = React.useState(null);
  const [body, setBody] = React.useState(null);

  const tc = React.useRef(null);
  const bc = React.useRef(null);
  React.useEffect(() => {
    const showListener = DeviceEventEmitter.addListener('showDoor', message => {
      if (DoorClose) {
        return;
      }
      DoorClose = true;
      if (message && message.title) {
        setTitle(message.title);
      }
      if (message && message.body) {
        setBody(message.body);
      }
      setShow(true);
      setRunning(true);
    });
    const hideListener = DeviceEventEmitter.addListener('hideDoor', () => {
      if (!DoorClose) {
        return;
      }
      DoorClose = false;
      setShow(false);
      try {
        //@ts-ignore
        tc.current.bounceInDown();
        //@ts-ignore
        bc.current.bounceInUp().then(endState => {
          if (endState.finished) {
            setRunning(false);
            setTitle(null);
            setBody(null);
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
          animation="bounceInDown"
          direction={show ? 'normal' : 'reverse'}
          style={styles.animContainer}>
          <View>
            <Image
              style={styles.logo}
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
              d="M0 25.98c149.99 100.02 349.2-59.96 500 0V150H0z"
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
          style={styles.animview}>
          <View style={styles.animbody}>
            <ActivityIndicator size="small" color="#e0e0e0" />
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {body ? <Text style={styles.body}>{body}</Text> : null}
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
