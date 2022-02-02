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
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 17,
  },
  introText: {
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 15,
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    color: Colors.foreground,
    fontFamily: 'RobotoSlab-Regular',
    textAlign: 'center',
    fontSize: 14,
  },
});
