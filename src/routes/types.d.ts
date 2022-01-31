import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamsList {}
  }
}

export type StackParamsList = {
  CoinDetailScreen: {
    isSupported?: boolean;
    coin: string;
    chain?: string;
    title: string;
    showAdd: boolean;
  };
  CustomTokenScreen: undefined;
  EnterPinScreen: undefined;
  GenerateWalletScreen: undefined;
  HomeScreens: NavigatorScreenParams<TabParamsList> | undefined;
  ImportWalletScreen: undefined;
  LanguageScreen: undefined;
  MarketScreen: undefined;
  NewsScreen: undefined;
  NFTScreen: undefined;
  OnBoardingScreen: undefined;
  ReEnterPinScreen: undefined;
  SearchScreen: {
    onlySupported: boolean;
  };
  SendReceiveScreen: {
    coin: string;
    chain: string;
    name: string;
    receive: boolean;
  };
  SetPinScreen: {
    new: boolean;
  };
  SettingScreen: undefined;
  SplashScreen: undefined;
  StartScreen: undefined;
  SwapScreen: {
    wallet: object | undefined;
  };
  ValidateWalletScreen: {
    mnemonic: string;
  };
  WalletScreen: {
    coin: string | null;
    symbol: string;
    chain: string;
  };
  WalletconnectScreen: undefined;
};

export type TabParamsList = {
  DashboardScreen: undefined;
  HubScreen: undefined;
  PortfolioScreen: undefined;
};

export type RootTabScreenProps<Screen extends keyof TabParamsList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamsList, Screen>,
    NativeStackScreenProps<StackParamsList>
  >;

export type RootStackScreenProps<Screen extends keyof StackParamsList> =
  NativeStackScreenProps<StackParamsList, Screen>;
