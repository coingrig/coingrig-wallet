import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  itemtext: {color: Colors.foreground},
  textr: {color: Colors.foreground},
  viewStatsDetail: {
    paddingHorizontal: 20,
    // backgroundColor: Colors.darker,
    marginVertical: 1,
    paddingBottom: 20,
  },
});
