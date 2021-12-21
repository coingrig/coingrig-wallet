import React, {useEffect} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {Pincode} from '../../components/pincode';

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

  return <Pincode onSuccess={() => success()} status={'choose'} />;
};

export default SetPinScreen;
