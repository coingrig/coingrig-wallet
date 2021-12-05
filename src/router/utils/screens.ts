import SplashScreen from 'screens/Splash';
import SearchScreen from 'screens/Search';
import GenerateWalletScreen from 'screens/WalletSetup/generateWallet';
import ValidateWalletScreen from 'screens/WalletSetup/validateWallet';
import StartScreen from 'screens/Start';
import EnterPinScreen from 'screens/Pin/enterPin';
import ReEnterPinScreen from 'screens/Pin/reEnterPin';
import SetPinScreen from 'screens/Pin/setPin';
import ImportWalletScreen from 'screens/WalletSetup/importWallet';
import SettingScreen from 'screens/Settings';
import SendReceiveScreen from 'screens/SendReceive';
import WalletScreen from 'screens/Wallet';
import NewsScreen from 'screens/News';
import CoinDetailScreen from 'screens/CoinDetails';
import OnBoardingScreen from 'screens/Onboarding';
import {CardStyleInterpolators} from '@react-navigation/stack';
import {Colors} from 'utils/colors';
import {BottomTabs} from './index';
import Icon from './components/Icon';

export const screens = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
    options: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
  },
  {
    name: 'OnBoardingScreen',
    component: OnBoardingScreen,
    options: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
  },
  {
    name: 'StartScreen',
    component: StartScreen,
    options: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
  },
  {
    name: 'SetPinScreen',
    component: SetPinScreen,
    options: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
  },
  {
    name: 'ReEnterPinScreen',
    component: ReEnterPinScreen,
    options: {
      animationEnabled: false,
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
  },
  {
    name: 'EnterPinScreen',
    component: EnterPinScreen,
    options: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
  },
  {
    name: 'GenerateWalletScreen',
    component: GenerateWalletScreen,
    options: {
      headerShown: false,
      title: '',
      headerStyle: {
        shadowColor: 'transparent', // ios
        elevation: 0, // android
        backgroundColor: 'transparent',
      },
      headerTintColor: Colors.foreground,
      headerBackTitleVisible: false,
      headerBackTitleStyle: {
        fontFamily: 'RobotoSlab-Regular',
      },
      headerTitleStyle: {
        fontWeight: '400',
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 20,
        justifyContent: 'center',
      },
    },
  },
  {
    name: 'SearchScreen',
    component: SearchScreen,
    options: {
      headerShown: false,
      animationEnabled: false,
    },
  },
  {
    name: 'ValidateWalletScreen',
    component: ValidateWalletScreen,
    options: {
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
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 20,
        justifyContent: 'center',
      },
    },
  },
  {
    name: 'ImportWalletScreen',
    component: ImportWalletScreen,
    options: {
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
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 20,
        justifyContent: 'center',
      },
    },
  },
  {
    name: 'HomeScreens',
    component: BottomTabs,
    options: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
    },
  },
  {
    name: 'WalletScreen',
    component: WalletScreen,
    options: {
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
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 20,
        justifyContent: 'center',
      },
    },
  },
  {
    name: 'NewsScreen',
    component: NewsScreen,
    options: {
      headerShown: true,
      headerTitle: 'News',
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
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 20,
        justifyContent: 'center',
      },
    },
  },
  {
    name: 'SettingScreen',
    component: SettingScreen,
    options: {
      headerShown: true,
      headerTitle: 'Settings',
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
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 20,
        justifyContent: 'center',
      },
    },
  },
  {
    name: 'CoinDetailScreen',
    component: CoinDetailScreen,
    options: {
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
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 20,
        justifyContent: 'center',
      },
    },
  },
  {
    name: 'SendReceiveScreen',
    component: SendReceiveScreen,
    options: {
      presentation: 'modal',
      cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
      headerShown: true,
      title: '',
      headerBackImage: () => Icon,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerStyle: {
        shadowColor: 'transparent', // ios
        elevation: 0, // android
      },
      headerTintColor: Colors.foreground,
      headerBackTitleStyle: {
        fontFamily: 'RobotoSlab-Regular',
      },
      headerTitleStyle: {
        fontWeight: '400',
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 20,
        justifyContent: 'center',
      },
    },
  },
];
