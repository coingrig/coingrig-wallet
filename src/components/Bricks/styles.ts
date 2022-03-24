import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  icon: {
    width: 30,
    height: 30,
  },
  logoimg: {
    width: 30,
    height: 30,
    opacity: 0.9,
  },
  dollar: {
    fontSize: 18,
    marginBottom: 10,
    color: Colors.foreground,
    fontFamily: 'RobotoSlab-Regular',
  },
  coinValue: {
    fontSize: 13,
    marginBottom: 5,
    color: Colors.chart,
    fontFamily: 'RobotoSlab-Regular',
  },
  endBrick: {
    fontSize: 18,
    marginBottom: 10,
    color: Colors.background,
    fontFamily: 'RobotoSlab-Regular',
  },
  svg: {
    height: '40%',
    width: '140',
    margin: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: -1,
    borderRadius: 20,
  },
  tcontainer: {flex: 1},
  bcontainer: {justifyContent: 'flex-end', margin: 10, marginBottom: 30},
  logo: {
    width: 45,
    height: 45,
    backgroundColor: Colors.brickIcon,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  coinName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.yellow,
  },
  brick: {
    width: 140,
    height: 200,
    margin: 7,
    borderRadius: 15,
    padding: 10,
  },
});
