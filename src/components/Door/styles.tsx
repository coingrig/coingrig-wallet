import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
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
  animContainer: {
    height: '100%',
    marginTop: -60,
  },
  title: {
    color: '#d4cfcf',
    fontSize: 19,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 20,
  },
  body: {
    color: '#aba4a4',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
  animview: {
    width: '100%',
    height: '110%',
    position: 'absolute',
    bottom: -80,
    transform: [{scaleX: 1}],
  },
  animbody: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    marginBottom: 150,
    marginHorizontal: 40,
  },
  logo: {
    height: 70,
    width: 70,
    tintColor: 'white',
    zIndex: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 200,
    opacity: 0.8,
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
