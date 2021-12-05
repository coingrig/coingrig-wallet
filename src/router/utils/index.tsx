import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CONFIG from 'config';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image, Platform, View, Text} from 'react-native';
import {Colors} from 'utils/colors';
import {tabs} from './tabs';

export const isTestnet = () => {
  if (!CONFIG.TESTNET) {
    return;
  }
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
};

export const TabLogo = (inverse = false) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../assets/logo_small.png')}
        style={{
          height: 280 / 13,
          width: 279 / 13,
          tintColor: inverse ? Colors.foreground : Colors.background,
          marginLeft: 3,
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
        source={require('../../assets/logo_small.png')}
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

const Tab = createBottomTabNavigator();

export function BottomTabs() {
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
            return focused ? TabLogo(false) : TabLogo(true);
          } else if (route.name === 'PortfolioScreen') {
            return (
              <Icon
                name="wallet"
                size={24}
                color={focused ? Colors.inverse : Colors.foreground}
              />
            );
          } else if (route.name === 'MarketScreen') {
            return (
              <Icon
                name="stats-chart"
                size={22}
                color={focused ? Colors.inverse : Colors.foreground}
              />
            );
          }
          return null;
        },
      })}>
      {tabs?.map(({name, component, options}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Tab.Navigator>
  );
}
