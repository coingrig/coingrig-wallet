import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from 'utils/colors';

export function BigButton(props) {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.bigBtn, {backgroundColor: props.backgroundColor}]}
      onPress={() => props.onPress()}>
      <Text
        style={[
          styles.bigBtnText,
          // eslint-disable-next-line react-native/no-inline-styles
          {color: props.disabled ? 'gray' : props.color},
        ]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bigBtn: {
    borderWidth: 0.5,
    padding: 15,
    borderRadius: 30,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 5,
    minWidth: 250,
    borderColor: Colors.foreground,
  },
  bigBtnText: {
    fontSize: 20,
    fontFamily: 'RobotoSlab-Bold',
    textAlign: 'center',
  },
});
