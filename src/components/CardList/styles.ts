import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  listTitle: {
    fontWeight: 'bold',
  },
  list: {
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
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
  soon: {
    color: 'gray',
    fontSize: 11,
    width: 60,
    textAlign: 'right',
  },
  ico: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    borderRadius: 100,
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 16,
    color: Colors.foreground,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  desc: {fontSize: 13, color: Colors.lighter},
});
