import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  scrollview: {
    flexGrow: 1,
    marginHorizontal: 15,
    paddingTop: 0,
  },
  textItem: {
    marginLeft: 0,
    marginTop: 20,
    color: Colors.foreground,
    textAlign: 'center',
  },
  title: {
    fontSize: 35,
    color: Colors.foreground,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lighter,
    marginVertical: 10,
  },
  warningText: {
    color: Colors.lighter,
    marginHorizontal: 20,
    fontSize: 13,
    textAlign: 'center',
  },
  image: {height: 30, width: 30},
  item: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  textInput: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.foreground,
    borderStyle: 'solid',
    minHeight: 130,
    marginHorizontal: 0,
    flex: 1,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2e2c2c',
    fontFamily: 'RobotoSlab-Bold',
    width: '70%',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
