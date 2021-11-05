/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import 'react-native-gesture-handler';
import {Image, Platform, View, Text} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'screens/Splash';
import DashboardScreen from 'screens/Dashboard';
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
import MarketScreen from 'screens/Market';
import NewsScreen from 'screens/News';
import CoinDetailScreen from './screens/CoinDetails';
import OnBoardingScreen from './screens/Onboarding';
import {Colors} from 'utils/colors';
import CONFIG from 'config';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const isTestnet = () => {
  if (CONFIG.TESTNET) {
    return (
      <View
        style={{
          backgroundColor: '#d9534f',
          padding: 5,
          borderRadius: 5,
          marginLeft: 15,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 10,
          }}>
          TESTNET
        </Text>
      </View>
    );
  }
};

const SmallLogo = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('./assets/logo_small.png')}
        style={{
          height: 280 / 13,
          width: 279 / 13,
          tintColor: Colors.foreground,
          marginLeft: 3,
        }}
      />
      {isTestnet()}
    </View>
  );
};

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      headerMode="screen"
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarActiveBackgroundColor: Colors.foreground,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'android' ? 60 : 75,
          marginTop: 3,
        },
        tabBarItemStyle: {
          marginHorizontal: 20,
          borderRadius: 40,
          paddingVertical: 5,
          marginBottom: Platform.OS === 'android' && 10,
        },
        tabBarIcon: ({focused}) => {
          if (route.name === 'Dashboard') {
            return focused ? (
              <Icon name="wallet" size={26} color={Colors.inverse} />
            ) : (
              <Icon name="wallet" size={24} color={Colors.foreground} />
            );
          } else if (route.name === 'MarketScreen') {
            return focused ? (
              <Icon name="stats-chart" size={24} color={Colors.inverse} />
            ) : (
              <Icon name="stats-chart" size={22} color={Colors.foreground} />
            );
          } else if (route.name === 'SettingScreen') {
            return focused ? (
              <Icon name="settings-sharp" size={25} color={Colors.inverse} />
            ) : (
              <Icon name="settings-sharp" size={23} color={Colors.foreground} />
            );
          }
          return null;
        },
      })}>
      <Tab.Screen
        name="MarketScreen"
        component={MarketScreen}
        options={{
          // unmountOnBlur: true,
          headerShown: true,
          headerTitleAlign: 'left',
          headerTitle: props => <SmallLogo />,
          headerStyle: {
            shadowColor: 'transparent', // ios
            elevation: 0, // android
          },
          headerTintColor: Colors.foreground,
          headerTitleStyle: {
            fontWeight: '400',
            letterSpacing: 1,
            fontFamily: 'RobotoSlab-Regular',
            fontSize: 20,
            justifyContent: 'center',
          },
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: true,
          headerTitleAlign: 'left',
          headerTitle: props => <SmallLogo />,
          headerStyle: {
            shadowColor: 'transparent', // ios
            elevation: 0, // android
            // backgroundColor: '#f5f1e4'
          },
          headerTintColor: Colors.foreground,
          headerTitleStyle: {
            fontWeight: '400',
            letterSpacing: 1,
            fontFamily: 'RobotoSlab-Regular',
            fontSize: 20,
            justifyContent: 'center',
          },
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          headerShown: true,
          headerTitle: props => <SmallLogo />,
          headerTitleAlign: 'left',
          headerStyle: {
            shadowColor: 'transparent', // ios
            elevation: 0, // android
          },
          headerTintColor: Colors.foreground,
          headerTitleStyle: {
            fontWeight: '400',
            letterSpacing: 1,
            fontFamily: 'RobotoSlab-Regular',
            fontSize: 20,
            justifyContent: 'center',
          },
        }}
      />
    </Tab.Navigator>
  );
}
// const BT = React.memo(BottomTabs);
// export const NavigationScreens = React.memo(NS);
export function NavigationScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="OnBoardingScreen"
        component={OnBoardingScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="SetPinScreen"
        component={SetPinScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="ReEnterPinScreen"
        component={ReEnterPinScreen}
        options={{
          animationEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="EnterPinScreen"
        component={EnterPinScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="GenerateWalletScreen"
        component={GenerateWalletScreen}
        options={{
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
        }}
      />
      <Stack.Screen
        name="ValidateWalletScreen"
        component={ValidateWalletScreen}
        options={{
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
        }}
      />
      <Stack.Screen
        name="ImportWalletScreen"
        component={ImportWalletScreen}
        options={{
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
        }}
      />
      <Stack.Screen
        name="HomeScreens"
        component={BottomTabs}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={{
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
        }}
      />
      <Stack.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{
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
        }}
      />
      <Stack.Screen
        name="CoinDetailScreen"
        component={CoinDetailScreen}
        options={{
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
        }}
      />
      <Stack.Screen
        name="SendReceiveScreen"
        component={SendReceiveScreen}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          headerShown: true,
          title: '',
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{padding: 10}}
            />
          ),
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
        }}
      />
    </Stack.Navigator>
  );
}
