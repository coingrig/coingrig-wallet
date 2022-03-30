import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darker,
    borderRadius: 10,
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
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  imageSmall: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
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
