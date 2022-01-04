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
  title: {
    color: Colors.foreground,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    fontFamily:
      Platform.OS === 'ios' ? 'RobotoSlab-Bold' : 'RobotoSlab-Regular',
  },
  published: {color: Colors.lighter, fontSize: 13, marginTop: 10},
  source: {color: Colors.lighter, fontSize: 13, marginBottom: 5},
});
