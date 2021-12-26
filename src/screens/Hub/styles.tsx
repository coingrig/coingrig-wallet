import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 35,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
    marginTop: 0,
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'RobotoSlab-Regular',
    color: Colors.lighter,
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 20,
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
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  brickTitle: {
    fontSize: 15,
    paddingHorizontal: 10,
    color: Colors.lighter,
    fontFamily: 'RobotoSlab-Bold',
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
    // opacity: 0,
    // marginBottom: 2,
  },
  brick: {
    flex: 1,
    flexDirection: 'column',
    margin: 7,
    height: 130,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
