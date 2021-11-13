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
  logo: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 45,
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
    marginBottom: 50,
  },
  subtitle: {
    fontFamily: 'RobotoSlab-Regular',
  },
});
