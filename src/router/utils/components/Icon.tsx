import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from 'utils/colors';

const Icon = () => (
  <Ionicons
    name="close"
    size={30}
    color={Colors.foreground}
    style={{padding: 10}}
  />
);

export default Icon;
