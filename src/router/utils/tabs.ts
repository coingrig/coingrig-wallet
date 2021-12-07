import {Colors} from 'utils/colors';
import {SmallLogo} from './components/SmallLogo';
import DashboardScreen from 'screens/Dashboard';
import MarketScreen from 'screens/Market';
import PortfolioScreen from 'screens/Portfolio';

export const tabs = [
  {
    name: 'PortfolioScreen',
    component: PortfolioScreen,
    options: {
      // unmountOnBlur: true,
      headerShown: true,
      headerTitleAlign: 'left',
      headerTitle: () => SmallLogo,
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
    },
  },
  {
    name: 'Dashboard',
    component: DashboardScreen,
    options: {
      headerShown: true,
      headerTitleAlign: 'left',
      headerTitle: () => SmallLogo,
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
    },
  },
  {
    name: 'MarketScreen',
    component: MarketScreen,
    options: {
      headerShown: true,
      headerTitle: () => SmallLogo,
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
    },
  },
];
