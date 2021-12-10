import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

export function SmallButton(props) {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.smallBtn, props.style]}
      onPress={() => props.onPress()}>
      <Text
        style={[
          styles.smallBtnText,
          {color: props.color ? props.color : '#353333'},
        ]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

export function SmallButtonNoBorder(props) {
  return (
    <TouchableOpacity
      {...props}
      style={styles.smallBtnNoBorder}
      onPress={() => props.onPress()}>
      <Text style={styles.smallBtnText}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  smallBtn: {
    borderColor: '#353333',
    borderWidth: 2,
    padding: 10,
    borderRadius: 30,
    paddingHorizontal: 30,
    alignSelf: 'center',
    margin: 10,
    minWidth: 150,
  },
  smallBtnNoBorder: {
    padding: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
    margin: 10,
    minWidth: 100,
  },
  smallBtnText: {
    fontSize: 17,
    color: '#353333',
    fontFamily: 'RobotoSlab-Medium',
    textAlign: 'center',
  },
});
