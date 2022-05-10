import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waves: {
    height: '70%',
    width: '150%',
    margin: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: -5,
  },
  waves2: {
    height: '69%',
    width: '160%',
    margin: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: -5,
  },
  logo: {
    // fontFamily: 'RobotoSlab-Bold',
    // fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 1,
    marginTop: 20,
  },
  topContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  subtitle: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 13,
  },
});
