/* eslint-disable react/react-in-jsx-scope */
import PINCode from '@haskkor/react-native-pincode';
import {Colors} from '../utils/colors';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import React from 'react';

export function Pincode(props) {
  const {t} = useTranslation();

  return (
    <PINCode
      onFail={props.onFail}
      finishProcess={props.onSuccess}
      status={props.status}
      onClickButtonLockedPage={() => {
        if (props.onClickButtonLockedPage) {
          props.onClickButtonLockedPage();
        }
      }}
      colorCircleButtons={Colors.darker}
      stylePinCodeDeleteButtonText={{color: Colors.foreground}}
      colorPassword={Colors.foreground}
      colorPasswordEmpty={Colors.foreground}
      numbersButtonOverlayColor={Colors.lighter}
      stylePinCodeColorSubtitle={Colors.foreground}
      stylePinCodeColorTitle={Colors.foreground}
      stylePinCodeDeleteButtonColorShowUnderlay={Colors.foreground}
      stylePinCodeDeleteButtonColorHideUnderlay={Colors.foreground}
      stylePinCodeButtonNumber={Colors.foreground}
      stylePinCodeTextButtonCircle={styles.pinCode}
      stylePinCodeTextSubtitle={styles.pinCode}
      stylePinCodeTextTitle={styles.pinCode}
      styleLockScreenButton={{transform: [{scale: 0}]}}
      buttonDeleteText={t('pincode.buttonDeleteText')}
      subtitleChoose={t('pincode.subtitleChoose')}
      subtitleError={t('pincode.subtitleError')}
      textButtonLockedPage={t('pincode.textButtonLockedPage')}
      textCancelButtonTouchID={t('pincode.textCancelButtonTouchID')}
      textDescriptionLockedPage={t('pincode.textDescriptionLockedPage')}
      textSubDescriptionLockedPage={t('pincode.textSubDescriptionLockedPage')}
      textTitleLockedPage={t('pincode.textTitleLockedPage')}
      titleAttemptFailed={t('pincode.titleAttemptFailed')}
      titleChoose={t('pincode.titleChoose')}
      titleConfirm={t('pincode.titleConfirm')}
      titleConfirmFailed={t('pincode.titleConfirmFailed')}
      titleEnter={t('pincode.titleEnter')}
      titleValidationFailed={t('pincode.titleValidationFailed')}
      touchIDSentence={t('pincode.touchIDSentence')}
      touchIDTitle={t('pincode.touchIDTitle')}
    />
  );
}

const styles = StyleSheet.create({
  pinCode: {
    fontWeight: '300',
  },
});
