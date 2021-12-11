import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from 'utils/colors';

const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swapContainer: {
    marginTop: 30,
  },
  swapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    height: 100,
    marginVertical: 3,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.brick,
  },
  connector: {
    width: 50,
    height: 50,
    position: 'absolute',
    backgroundColor: Colors.brick,
    borderRadius: 100,
    top: 80,
    left: windowWidth / 2 - 25,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youPay: {
    color: Colors.lighter,
    fontSize: 15,
  },
  amount: {
    color: Colors.foreground,
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 10,
  },
  coinText: {
    color: Colors.foreground,
    fontSize: 15,
    fontWeight: 'bold',
    // paddingRight: 20,
    textAlign: 'right',
  },
  coin: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    justifyContent: 'flex-start',
  },
  tinyLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 100,
  },
});
