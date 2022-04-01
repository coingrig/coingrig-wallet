import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  container: {
    flex: 1,
  },
  customBtn: {
    backgroundColor: Colors.darker,
    borderWidth: 0,
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.brick,
    paddingVertical: 10,
    alignItems: 'center',
  },
  img: {
    width: 20,
    height: 20,
    marginRight: 0,
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    flex: 5,
    color: Colors.foreground,
    // marginLeft: 10,
    fontSize: 17,
  },
  itemSymbol: {
    flex: 1,
    color: Colors.lighter,
    marginLeft: 10,
    fontSize: 13,
    textAlign: 'right',
  },
  subTitle: {
    // marginLeft: 10,
    color: Colors.lighter,
    fontSize: 12,
    textAlign: 'left',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomColor: Colors.brick,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
  },
  search: {
    flex: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.brick,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    height: 45,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    color: Colors.foreground,
  },
  close: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brick,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
