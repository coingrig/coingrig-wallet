import {Platform, StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.card,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingHorizontal: 15,
    marginVertical: 3,
    height: 70,
  },
  title: {
    color: Colors.foreground,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    marginLeft: 10,
    fontFamily:
      Platform.OS === 'ios' ? 'RobotoSlab-Bold' : 'RobotoSlab-Regular',
  },
  moreBtn: {
    paddingHorizontal: 5,
    justifyContent: 'space-around',
    paddingRight: 15,
  },
  logoimg: {
    width: 30,
    height: 30,

    justifyContent: 'center',
    borderRadius: 100,
    padding: 17,
  },
  published: {color: Colors.lighter, fontSize: 13, marginTop: 10},
  source: {color: Colors.lighter, fontSize: 13, marginBottom: 5},
  desc: {
    color: Colors.lighter,
    fontSize: 12,
    marginHorizontal: 10,
    flex: 2,
  },
  headerMirror: {
    marginBottom: 16,
    flex: 1,
  },
  headersubtitle: {
    color: Colors.lighter,
    fontSize: 14,
    marginHorizontal: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  powered: {
    color: Colors.lighter,
    fontSize: 11,
    marginHorizontal: 10,
    marginTop: 4,
    fontWeight: 'bold',
  },
  mirrorimg: {
    height: 40,
    width: 40,
    justifyContent: 'center',
  },
  headersub: {
    flexDirection: 'row',
    width: '90%',
    marginHorizontal: 16,
  },
  header: {flex: 1, marginTop: 30, marginBottom: 10},
  subtitle: {fontSize: 10, marginLeft: 10, color: Colors.lighter},
});
