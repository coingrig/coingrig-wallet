import {StyleSheet, Dimensions, StatusBar, Platform} from 'react-native';
import {Colors} from 'utils/colors';
import {SIZE} from 'utils/constants';

const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swapContainer: {
    marginTop: 10,
  },
  swapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.card,
    height: 74,
    marginVertical: 2,
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.brick,
  },
  swapApproveContainer: {
    height: SIZE.height / 1.7,
    margin: 10,
    backgroundColor: Colors.card,
  },
  connector: {
    width: 36,
    height: 36,
    position: 'absolute',
    backgroundColor: Colors.brick,
    borderRadius: 100,
    top: 60,
    left: windowWidth / 2 - 18,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youPay: {
    color: Colors.lighter,
    fontSize: 13,
  },
  amount: {
    color: Colors.foreground,
    fontSize: 17,
    marginTop: Platform.OS == 'android' ? 0 : 5,
    paddingRight: 10,
    height: Platform.OS == 'android' ? 40 : 20,
    // backgroundColor: 'red',
    // flex: 1,
  },
  coinText: {
    color: Colors.foreground,
    fontSize: 14,
    flex: 1,
  },
  coin: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: 100,
    flex: 1,
    justifyContent: 'flex-start',
  },
  tinyLogo: {
    width: 28,
    height: 28,
    marginRight: 5,
    borderRadius: 100,
  },
  coinsSheet: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
    backgroundColor: Colors.background,
  },
  close: {
    position: 'absolute',
    backgroundColor: Colors.darker,
    width: 36,
    height: 36,
    left: 10,
    top: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
