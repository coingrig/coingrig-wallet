import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {marginHorizontal: 16},
  title: {
    fontSize: 35,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
    marginTop: 0,
    marginLeft: 15,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'RobotoSlab-Regular',
    color: Colors.lighter,
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 15,
  },
  search: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.brick,
    backgroundColor: Colors.border,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    color: Colors.foreground,
  },
  moreBtn: {
    paddingHorizontal: 5,
    justifyContent: 'space-around',
    paddingRight: 20,
  },
  headerShadow: {
    backgroundColor: Colors.background,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,

    elevation: 2,
  },
  headerNoShadow: {
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  brickTitle: {
    fontSize: 14,
    paddingHorizontal: 10,
    color: Colors.lighter,
    fontFamily: 'RobotoSlab-Medium',
    paddingVertical: 5,
    // paddingTop: 5,
  },
  brickDesc: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingTop: 2,
    color: Colors.lighter,
    paddingBottom: 5,
  },
  brickTxt: {
    backgroundColor: Colors.background,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    // opacity: 0,
    // marginBottom: 2,
  },
  brick: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 70,
    justifyContent: 'space-between',
  },
});
