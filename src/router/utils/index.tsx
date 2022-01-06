import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';
import {Colors} from 'utils/colors';
import {tabs} from './tabs';
import {TabLogo} from './components/TabLogo/';

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
