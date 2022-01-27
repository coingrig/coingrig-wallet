import {CardStyleInterpolators} from '@react-navigation/stack';
import {Colors} from 'utils/colors';

const styles: any = {};

styles.noAnim = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
};

styles.importWallet = {
  headerShown: false,
  title: '',
  headerStyle: {
    shadowColor: 'transparent', // ios
    elevation: 0, // android
  },
  headerTintColor: Colors.foreground,
  headerBackTitleVisible: false,
  headerBackTitleStyle: {
    fontFamily: 'RobotoSlab-Regular',
  },
  headerTitleStyle: {
    fontWeight: '400',

    fontFamily: 'RobotoSlab-Regular',
    fontSize: 19,
    justifyContent: 'center',
  },
};

styles.walletscreen = {
  headerShown: true,
  headerTitle: '',
  headerStyle: {
    backgroundColor: Colors.darker,
    shadowColor: 'transparent', // ios
    elevation: 0, // android
  },
  headerTintColor: Colors.foreground,
  headerBackTitleVisible: false,
  headerBackTitleStyle: {
    fontFamily: 'RobotoSlab-Regular',
  },
  headerTitleStyle: {
    fontWeight: '400',

    fontFamily: 'RobotoSlab-Regular',
    fontSize: 19,
    justifyContent: 'center',
  },
};

export default styles;
