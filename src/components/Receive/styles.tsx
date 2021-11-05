import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 0,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.18,
    // shadowRadius: 1.0,

    // elevation: 1,
  },
  qrcontainer: {flex: 1, justifyContent: 'center', marginTop: 50},
  qr: {
    height: 220,
    width: 220,
    borderColor: 'black',
    borderWidth: 0,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  share: {flex: 1, justifyContent: 'flex-end', marginBottom: 30},
  address: {
    fontSize: 15,
    fontFamily: 'RobotoSlab-Regular',
    marginBottom: 10,
    width: 230,
    textAlign: 'center',
    marginTop: 20,
    color: Colors.foreground,
  },
});
