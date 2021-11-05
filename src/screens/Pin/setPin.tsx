import React, {useEffect} from 'react';
import PINCode from '@haskkor/react-native-pincode';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {Colors} from 'utils/colors';

const SetPinScreen = ({route}) => {
  const navigation = useNavigation();

  useEffect(() => {}, []);

  const success = () => {
    const goTo = route.params.new
      ? 'GenerateWalletScreen'
      : 'ImportWalletScreen';

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: goTo}],
      }),
    );
  };

  return (
    <PINCode
      finishProcess={() => success()}
      status={'choose'}
      stylePinCodeDeleteButtonText={{color: Colors.foreground}}
      colorCircleButtons={Colors.darker}
      colorPassword={Colors.foreground}
      colorPasswordEmpty={Colors.foreground}
      numbersButtonOverlayColor={Colors.lighter}
      stylePinCodeColorSubtitle={Colors.foreground}
      stylePinCodeColorTitle={Colors.foreground}
      stylePinCodeDeleteButtonColorShowUnderlay={Colors.foreground}
      stylePinCodeDeleteButtonColorHideUnderlay={Colors.foreground}
      stylePinCodeButtonNumber={Colors.foreground}
      stylePinCodeTextButtonCircle={{fontWeight: '300'}}
      stylePinCodeTextSubtitle={{fontWeight: '300'}}
      stylePinCodeTextTitle={{fontWeight: '300'}}
    />
  );
};

export default SetPinScreen;
