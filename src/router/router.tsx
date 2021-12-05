/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {screens} from './utils/screens';

const Stack = createStackNavigator();

// const BT = React.memo(BottomTabs);
// export const NavigationScreens = React.memo(NS);

export const NavigationScreens = () => {
  return (
    <Stack.Navigator>
      {screens?.map(({name, component, options}) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  );
};
