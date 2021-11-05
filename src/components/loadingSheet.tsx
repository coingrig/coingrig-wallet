/* eslint-disable react-native/no-inline-styles */
import React, {createRef} from 'react';
import {Text} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import LottieView from 'lottie-react-native';
import {LoadingModal} from '../services/loading';
import {useTranslation} from 'react-i18next';
import {Colors} from './../utils/colors';

LoadingModal.instance = createRef();

export const LoadingSheet = () => {
  const {t} = useTranslation();

  return (
    <ActionSheet
      ref={LoadingModal.instance}
      closeOnTouchBackdrop={false}
      containerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.darker,
      }}>
      <LottieView
        source={require('../assets/lottie/loading.json')}
        autoPlay
        loop
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          height: 200,
          marginTop: 20,
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          marginBottom: 30,
          fontSize: 20,
          marginTop: 0,
          color: Colors.foreground,
        }}>
        {t('modal.please_wait')}
      </Text>
    </ActionSheet>
  );
};
