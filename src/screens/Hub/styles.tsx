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
    paddingHorizontal: 5,
    color: Colors.foreground,
    backgroundColor: Colors.border,
    fontFamily: 'RobotoSlab-Bold',
    paddingTop: 5,
  },
  brickDesc: {
    fontSize: 11,
    paddingHorizontal: 5,
    paddingTop: 2,
    color: Colors.lighter,
    paddingBottom: 5,
    backgroundColor: Colors.border,
  },
  brick: {
    flex: 1,
    flexDirection: 'column',
    margin: 10,
    height: 160,
    backgroundColor: Colors.card,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: Colors.border,
  },
});
