import React, {useRef, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useTranslation} from 'react-i18next';
import {useNavigation, CommonActions} from '@react-navigation/native';
import Privacy from 'assets/svg/sec.svg';
import Rocket from 'assets/svg/rocket.svg';
import Finance from 'assets/svg/market.svg';
import {styles} from './styles';

const OnBoardingScreen = () => {
  const pw = useRef(null);
  const {t} = useTranslation();
  const [position, setPosition] = useState(0);
  const navigation = useNavigation();

  const pageSelected = ev => {
    setPosition(ev.nativeEvent.position);
  };
  const nextPage = () => {
    const nextPosition = position + 1;
    if (nextPosition >= 3) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'StartScreen'}],
        }),
      );
      return;
    }
    //@ts-ignore
    pw.current?.setPage(nextPosition);
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pw}
        style={styles.pager}
        initialPage={position}
        showPageIndicator
        onPageSelected={e => pageSelected(e)}>
        <View key="1" style={styles.pagerView}>
          <Rocket width={280} height={350} />
          <Text style={styles.desc}>{t('onboarding.text2')}</Text>
        </View>
        <View key="2" style={styles.pagerView}>
          <Finance width={230} height={350} />
          <Text style={styles.desc}>{t('onboarding.text3')}</Text>
        </View>
        <View key="3" style={styles.pagerView}>
          <Privacy width={280} height={350} />
          <Text style={styles.desc}>{t('onboarding.text1')}</Text>
        </View>
      </PagerView>
      <View style={styles.footer}>
        <Pressable onPress={nextPage} style={styles.button}>
          <Text style={styles.text}>{t('onboarding.next')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
