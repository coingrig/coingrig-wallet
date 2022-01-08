import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  change: {
    fontSize: 18,
    fontFamily: 'RobotoSlab-Bold',
    color: '#756156',
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
  textInputStyle: {
    borderBottomWidth: 1,
    borderColor: Colors.lighter,
    marginVertical: 10,
    marginLeft: 15,
    marginRight: 20,
    fontSize: 16,
    height: 40,
    color: Colors.foreground,
  },
  title: {
    fontSize: 35,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
    marginTop: 0,
    marginLeft: 15,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.lighter,
    marginVertical: 20,
    marginLeft: 15,
  },
  moreBtn: {
    paddingHorizontal: 5,
    justifyContent: 'space-around',
    paddingRight: 13,
  },
  pillsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 15,
    flexDirection: 'row',
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
  subLeft: {
    fontSize: 16,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.lighter,
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 20,
  },
  subRight: {
    fontSize: 16,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.lighter,
    marginBottom: 10,
    marginRight: 20,
    marginTop: 20,
  },
  appButtonText: {
    fontSize: 11,
    color: Colors.foreground,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
