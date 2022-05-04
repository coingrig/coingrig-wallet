import {Platform, StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'column',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 3,
  },
  itemCrypto: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.card,
    // justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 3,
  },
  listImg: {
    width: 45,
    height: 45,
    marginRight: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    // marginVertical: 10,
    borderRadius: 100,
  },
  title: {
    color: Colors.foreground,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
    flex: 1,
    fontFamily:
      Platform.OS === 'ios' ? 'RobotoSlab-Bold' : 'RobotoSlab-Regular',
  },
  published: {color: Colors.lighter, fontSize: 12, marginTop: 5},
  source: {color: Colors.lighter, fontSize: 13, marginBottom: 5},
});
