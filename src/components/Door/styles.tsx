import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    position: 'absolute',
    // backgroundColor: 'red',
    height: '100%',
    width: '100%',
  },
  waves: {
    height: '100%',
    width: '150%',
    margin: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: -5,
  },
  waves2: {
    height: '98%',
    width: '160%',
    margin: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: -5,
  },
  logo: {
    // fontFamily: 'RobotoSlab-Light',
    fontSize: 20,
    letterSpacing: 1,
    marginTop: 20,
  },
  topContainer: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  subtitle: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 13,
  },
});
