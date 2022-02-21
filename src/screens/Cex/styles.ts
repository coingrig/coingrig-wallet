import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  scrollview: {marginTop: 15, marginHorizontal: 0},
  scrollviewDetails: {marginTop: 0, marginHorizontal: 0},
  header: {
    backgroundColor: Colors.darker,
    minHeight: 20,
    marginBottom: 20,
  },
  collapse: {
    position: 'absolute',
    zIndex: 10,
    right: 5,
    backgroundColor: Colors.darker,
    padding: 5,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: Colors.lighter,
  },
  image: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    color: Colors.foreground,
    fontSize: 22,
    fontWeight: 'bold',
  },
  desc: {
    color: Colors.lighter,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
});
