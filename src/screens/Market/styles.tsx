import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  change: {
    fontSize: 18,
    fontFamily: 'RobotoSlab-Bold',
    color: '#756156',
  },
  textInputStyle: {
    color: 'gray',
    marginLeft: 15,
    fontSize: 15,
  },
  searchbar: {
    marginTop: 15,
    marginHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: Colors.brick,
    backgroundColor: Colors.border,
    borderRadius: 5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
    marginTop: 0,
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.lighter,
    marginTop: 10,
    marginLeft: 20,
    alignSelf: 'center',
  },
  moreBtn: {
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    flexDirection: 'row',
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  pillsContainer: {
    marginBottom: 5,
    marginTop: 15,
    flexDirection: 'row',
    marginRight: 10,
  },
  appButtonContainerSelected: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.pill,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  appButtonContainer: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  appButtonText: {
    fontSize: 11,
    color: Colors.foreground,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
