import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1A1919',
    borderRadius: 100,
    padding: 15,
  },
  topContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  bottomContainer: {
    flex: 1,
  },
  subContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  icons: {marginTop: 15, marginLeft: 25},
  subtitle: {
    fontSize: 16,
    fontFamily: 'RobotoSlab-Regular',
    color: Colors.lighter,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: Colors.lighter,
    marginLeft: 10,
  },
  vLine: {
    width: 1,
    height: 25,
    backgroundColor: Colors.lighter,
    marginHorizontal: 20,
  },
  infoCard: {
    backgroundColor: Colors.darker,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  infoContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  balance: {
    fontSize: 20,
    fontFamily: 'RobotoSlab-Regular',
    textAlign: 'center',
    color: Colors.lighter,
  },
  coinValue: {
    fontSize: 70,
    fontFamily: 'RobotoSlab-Bold',
    textAlign: 'center',
    color: '#1F1C1D',
    maxWidth: '80%',
  },
  fiatValue: {
    fontSize: 40,
    fontFamily: 'RobotoSlab-Bold',
    textAlign: 'center',
    color: Colors.foreground,
    marginTop: 10,
    marginHorizontal: 30,
  },
  btnImg: {
    width: 40,
    height: 40,
  },
  moreImg: {
    width: 17,
    height: 17,
  },
  moreBtn: {
    paddingHorizontal: 5,
    justifyContent: 'space-around',
    paddingRight: 20,
  },
});
