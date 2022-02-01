import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  flexcontainer: {
    flexGrow: 1,
  },
  activityIndicator: {
    marginTop: 30,
  },
  footerButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 40,
  },
  previewText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    fontFamily: 'RobotoSlab-Regular',
    color: Colors.lighter,
  },
  warning: {
    fontSize: 12,
    color: Colors.lighter,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  introText: {
    marginTop: 15,
    marginLeft: 15,
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    color: Colors.foreground,
    fontFamily: 'RobotoSlab-Medium',
    fontSize: 15,
  },
});
