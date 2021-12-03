import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';
import {SIZE} from 'utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flexGrow: 1,
    marginHorizontal: 15,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wclogo: {
    width: 120,
    marginTop: -200,
  },
  disconnect: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  peerIcon: {
    width: 80,
    height: 80,
    tintColor: Colors.foreground,
    marginTop: -150,
  },
  connectedTxt: {
    textAlign: 'center',
    color: Colors.lighter,
    fontSize: 12,
  },
  connected: {
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'absolute',
    top: 0,
  },
  smallBtn: {
    backgroundColor: Colors.foreground,
    // marginTop: 30,
    borderWidth: 0,
  },
  cameracontainer: {
    height: SIZE.height / 1.7,
    margin: 10,
    backgroundColor: 'black',
  },
  paragraph: {
    textAlign: 'center',
    marginVertical: 20,
    marginHorizontal: 40,
    fontSize: 14,
    color: Colors.lighter,
  },
  unconfirmed: {
    marginBottom: 20,
    fontSize: 12,
    marginHorizontal: 10,
    marginTop: 5,
    color: Colors.foreground,
  },
  textItem: {marginLeft: 10, color: Colors.foreground, flex: 3},
  title: {
    fontSize: 35,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
    marginTop: 0,
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.lighter,
    marginVertical: 20,
  },
});
