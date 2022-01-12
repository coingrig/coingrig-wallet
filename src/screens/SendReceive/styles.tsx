import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  loadingView: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  segment: {
    backgroundColor: Colors.darker,
    marginHorizontal: 15,
    height: 35,
    marginBottom: 10,
  },
});
