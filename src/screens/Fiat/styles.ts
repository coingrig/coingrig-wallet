import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  editContainer: {
    // height: 300,
    margin: 10,
    backgroundColor: Colors.background,
  },
  editTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 20,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
  },
  editInput: {
    color: 'black',
    backgroundColor: 'white',
    height: 45,
    width: '70%',
    borderRadius: 30,
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 17,
    marginVertical: 3,
  },
});
