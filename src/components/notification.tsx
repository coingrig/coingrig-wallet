import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';

export const TopNotification = ({title, message}) => {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.content}
          activeOpacity={0.3}
          underlayColor="transparent">
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <Text numberOfLines={1} style={styles.message}>
              {message}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#303030',
  },
  container: {
    position: 'absolute',
    top: isIphoneX() && getStatusBarHeight() ? getStatusBarHeight() : 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  iconApp: {
    marginTop: 10,
    marginLeft: 20,
    resizeMode: 'contain',
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  icon: {
    marginTop: 10,
    marginLeft: 10,
    resizeMode: 'contain',
    width: 48,
    height: 48,
  },
  textContainer: {
    alignSelf: 'center',
    marginLeft: 20,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  message: {
    color: '#FFF',
    marginTop: 5,
  },
  footer: {
    backgroundColor: '#696969',
    borderRadius: 5,
    alignSelf: 'center',
    height: 5,
    width: 35,
    margin: 5,
  },
});
