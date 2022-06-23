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
import {withTranslation} from 'react-i18next';
import SplashScreen from 'screens/Splash';
import DashboardScreen from 'screens/Dashboard';
import SearchScreen from 'screens/Search';
import GenerateWalletScreen from 'screens/WalletSetup/generateWallet';
import ValidateWalletScreen from 'screens/WalletSetup/validateWallet';
import StartScreen from 'screens/Start';
import HubScreen from 'screens/Hub';
import SwapScreen from 'screens/Swap';
import EnterPinScreen from 'screens/Pin/enterPin';
import ReEnterPinScreen from 'screens/Pin/reEnterPin';
import SetPinScreen from 'screens/Pin/setPin';
import ImportWalletScreen from 'screens/WalletSetup/importWallet';
import SettingScreen from 'screens/Settings';
import LanguageScreen from 'screens/Language';
import SendReceiveScreen from 'screens/SendReceive';
import WalletScreen from 'screens/Wallet';
import MarketScreen from 'screens/Market';
import PortfolioScreen from 'screens/Portfolio';
import CryptoNewsScreen from 'screens/News/Crypto';
import StockNewsScreen from 'screens/News/Stock';
import CoinDetailScreen from 'screens/CoinDetails';
import OnBoardingScreen from 'screens/Onboarding';
import WalletconnectScreen from 'screens/Walletconnect';
import CustomTokenScreen from 'screens/CustomToken';
import TokenConnectScreen from 'screens/TokenConnect';
import NFTScreen from 'screens/Portfolio/NFTDetails';
import FeedbackScreen from 'screens/Feedback';

import {Colors} from 'utils/colors';
import CONFIG from 'config';
import styles from './styles';
import SyntheticScreen from 'screens/Synthetic';
import CEXScreen from 'screens/Cex';
import CexDetails from 'screens/Cex/Details';
import AddBank from 'screens/Banking/AddBank';
import SelectCountry from 'screens/Banking/SelectCountry';
import AddFiat from 'screens/Fiat';
import SearchStocks from 'screens/SearchStocks';
import SummaryScreen from 'screens/Summary';
import InviteScreen from 'components/Invite';
import WebScreen from 'screens/Web';
import HistoryScreen from 'screens/History';
import ReferralHistory from 'screens/History/Referral';
import TradeScreen from 'screens/Trade';

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

const TabLogo = (inverse = false) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../assets/logo_small.png')}
        style={{
          height: 280 / 13,
          width: 279 / 13,
          tintColor: inverse ? Colors.foreground : Colors.background,
          // marginLeft: 3,
        }}
      />
    </View>
  );
};

export const SmallLogo = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../assets/logo_small.png')}
        style={{
          height: 280 / 13,
          width: 279 / 13,
          tintColor: Colors.foreground,
          // marginLeft: 3,
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
      //@ts-ignore
      headerMode="screen"
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarActiveBackgroundColor: Colors.foreground,
        tabBarStyle: {
          borderTopWidth: 1,
          elevation: 0,
          height: Platform.OS === 'android' ? 60 : 80,
          backgroundColor: Colors.background,
          borderTopColor: Colors.tabborder,
          paddingTop: 5,
        },
        tabBarItemStyle: {
          marginHorizontal: 20,
          borderRadius: 40,
          paddingVertical: 5,
          marginBottom: Platform.OS === 'android' && 5,
        },
        tabBarIcon: ({focused}) => {
          if (route.name === 'Dashboard') {
            return focused ? TabLogo(false) : TabLogo(true);
          } else if (route.name === 'PortfolioScreen') {
            return focused ? (
              <Icon name="wallet" size={25} color={Colors.inverse} />
            ) : (
              <Icon name="wallet" size={25} color={Colors.foreground} />
            );
          } else if (route.name === 'HubScreen') {
            return focused ? (
              <Icon name="layers" size={25} color={Colors.inverse} />
            ) : (
              <Icon name="layers" size={25} color={Colors.foreground} />
            );
          }
          return null;
        },
      })}>
      <Tab.Screen
        name="PortfolioScreen"
        component={PortfolioScreen}
        options={{
          // unmountOnBlur: true,
          headerShown: true,
          headerTitleAlign: 'left',
          headerTitle: () => <SmallLogo />,
          headerStyle: {
            shadowColor: 'transparent', // ios
            elevation: 0, // android
          },
          headerTintColor: Colors.foreground,
          headerTitleStyle: {
            fontWeight: '400',

            fontFamily: 'RobotoSlab-Regular',
            fontSize: 19,
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
          headerTitle: () => <SmallLogo />,
          headerStyle: {
            shadowColor: 'transparent', // ios
            elevation: 0, // android
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.foreground,
          headerTitleStyle: {
            fontWeight: '400',

            fontFamily: 'RobotoSlab-Regular',
            fontSize: 19,
            justifyContent: 'center',
          },
        }}
      />
      <Tab.Screen
        name="HubScreen"
        component={HubScreen}
        options={{
          headerShown: true,
          headerTitle: () => <SmallLogo />,
          headerTitleAlign: 'left',
          headerStyle: {
            shadowColor: 'transparent', // ios
            elevation: 0, // android
          },
          headerTintColor: Colors.foreground,
          headerTitleStyle: {
            fontWeight: '400',

            fontFamily: 'RobotoSlab-Regular',
            fontSize: 19,
            justifyContent: 'center',
          },
        }}
      />
    </Tab.Navigator>
  );
}

function NavigationStack({t}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={styles.noAnim}
      />
      <Stack.Screen
        name="OnBoardingScreen"
        component={OnBoardingScreen}
        options={styles.noAnim}
      />
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={styles.noAnim}
      />
      <Stack.Screen
        name="SetPinScreen"
        component={SetPinScreen}
        options={styles.noAnim}
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
        options={styles.noAnim}
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

            fontFamily: 'RobotoSlab-Regular',
            fontSize: 19,
            justifyContent: 'center',
          },
        }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="SearchStocks"
        component={SearchStocks}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="ValidateWalletScreen"
        component={ValidateWalletScreen}
        options={styles.importWallet}
      />
      <Stack.Screen
        name="ImportWalletScreen"
        component={ImportWalletScreen}
        options={styles.importWallet}
      />
      <Stack.Screen
        name="HomeScreens"
        component={BottomTabs}
        options={styles.noAnim}
      />
      <Stack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={styles.walletscreen}
      />
      <Stack.Screen
        name="CryptoNewsScreen"
        component={CryptoNewsScreen}
        options={{
          headerShown: true,
          headerTitle: t('title.crypto_news'),
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
        }}
      />
      <Stack.Screen
        name="SummaryScreen"
        component={SummaryScreen}
        options={{
          headerShown: true,
          headerTitle: t('summary.title'),
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
        }}
      />
      <Stack.Screen
        name="StockNewsScreen"
        component={StockNewsScreen}
        options={{
          headerShown: true,
          headerTitle: t('title.stock_news'),
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
        }}
      />
      <Stack.Screen
        name="CEXScreen"
        component={CEXScreen}
        options={{
          headerShown: true,
          headerTitle: t('CEXs'),
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
        }}
      />
      <Stack.Screen
        name="AddBankScreen"
        component={AddBank}
        options={{
          headerShown: true,
          headerTitle: t('portfolio.banks.select_bank'),
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
        }}
      />
      <Stack.Screen
        name="AddFiat"
        component={AddFiat}
        options={{
          headerShown: true,
          headerTitle: t('portfolio.fiat.select_title'),
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
        }}
      />
      <Stack.Screen
        name="SelectCountryScreen"
        component={SelectCountry}
        options={{
          headerShown: true,
          headerTitle: t('portfolio.banks.select_country'),
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
        }}
      />
      <Stack.Screen
        name="TradeScreen"
        component={TradeScreen}
        options={{
          headerShown: true,
          headerTitle: t('trade.title'),
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
        }}
      />
      <Stack.Screen
        name="CexDetails"
        component={CexDetails}
        options={{
          headerShown: false,
          headerTransparent: true,
          animationEnabled: false,
          // headerTitle: t('hub.synthetics'),
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{paddingLeft: 10}}
            />
          ),
          headerStyle: {
            backgroundColor: 'transparent',
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
        }}
      />
      <Stack.Screen
        name="SyntheticScreen"
        component={SyntheticScreen}
        options={{
          headerShown: true,
          headerTitle: t('hub.synthetics'),
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
        }}
      />
      <Stack.Screen
        name="WalletconnectScreen"
        component={WalletconnectScreen}
        options={{
          presentation: 'modal',
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{paddingLeft: 10}}
            />
          ),
          headerShown: true,
          headerTitle: 'WalletConnect',
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
        }}
      />
      <Stack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{
          presentation: 'modal',
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{paddingLeft: 10}}
            />
          ),
          headerShown: true,
          headerTitle: t('settings.change_language'),
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
        }}
      />
      <Stack.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{paddingLeft: 10}}
            />
          ),
          headerShown: true,
          headerTitle: t('settings.feedback'),
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
        }}
      />
      <Stack.Screen
        name="TokenConnectScreen"
        component={TokenConnectScreen}
        options={{
          presentation: 'modal',
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{paddingLeft: 10}}
            />
          ),
          headerShown: true,
          headerTitle: t('token_connect.title'),
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
        }}
      />
      <Stack.Screen
        name="CustomTokenScreen"
        component={CustomTokenScreen}
        options={{
          presentation: 'modal',
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{paddingLeft: 10}}
            />
          ),
          headerShown: true,
          headerTitle: t('title.add_custom_token'),
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
        }}
      />
      <Stack.Screen
        name="SwapScreen"
        component={SwapScreen}
        options={{
          // animationEnabled: Platform.OS === 'ios' ? true : false,
          headerShown: false,
          presentation: Platform.OS === 'ios' ? 'modal' : 'card',
        }}
      />
      <Stack.Screen
        name="NFTScreen"
        component={NFTScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          headerTitle: t('title.swap'),
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
        name="SettingScreen"
        component={SettingScreen}
        options={{
          headerShown: true,
          headerTitle: t('title.settings'),
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
        }}
      />
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerShown: true,
          headerTitle: t('history.title'),
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
        }}
      />
      <Stack.Screen
        name="ReferralHistory"
        component={ReferralHistory}
        options={{
          headerShown: true,
          headerTitle: t('history.referral.title'),
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
        }}
      />
      <Stack.Screen
        name="InviteScreen"
        component={InviteScreen}
        options={{
          headerShown: true,
          headerTitle: t(''),
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
        }}
      />
      <Stack.Screen
        name="WebScreen"
        component={WebScreen}
        options={{
          presentation: 'modal',
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{paddingLeft: 10}}
            />
          ),
          headerShown: true,
          headerTitle: t(''),
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

            fontFamily: 'RobotoSlab-Regular',
            fontSize: 19,
            justifyContent: 'center',
          },
        }}
      />
      <Stack.Screen
        name="MarketScreen"
        component={MarketScreen}
        options={{
          headerShown: true,
          headerTitle: t('market.market'),
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
        }}
      />
      <Stack.Screen
        name="SendReceiveScreen"
        component={SendReceiveScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: '',
          headerBackImage: () => (
            <Icon
              name="close"
              size={30}
              color={Colors.foreground}
              style={{paddingLeft: 10}}
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

            fontFamily: 'RobotoSlab-Regular',
            fontSize: 19,
            justifyContent: 'center',
          },
        }}
      />
    </Stack.Navigator>
  );
}
export const NavigationScreens = withTranslation()(NavigationStack);
