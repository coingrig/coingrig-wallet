import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {CoinsAvatar} from 'components/coinsAvatar';
import {formatPrice} from '../utils';
import {Colors} from 'utils/colors';

const MarketItem = (props: {
  coin: string;
  key: string;
  name: string;
  price: number;
  image: string;
  change: number;
  onPress?: any;
}) => {
  return (
    <TouchableOpacity
      onPress={props.onPress ? props.onPress : null}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{height: 80, marginVertical: 3}}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logo}>
            <CoinsAvatar
              style={styles.logoimg}
              coin={props.coin}
              source={props.image}
            />
          </View>
          <View style={styles.mcontainer}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={2}
              style={styles.coinName}>
              {props.name}
            </Text>
            <Text style={styles.coinSymbol}>{props.coin.toUpperCase()}</Text>
          </View>
          <View style={styles.rcontainer}>
            <View style={styles.bgprice}>
              <Text style={styles.price}>{formatPrice(props.price)}</Text>
            </View>
            <Text
              style={[
                styles.change,
                // eslint-disable-next-line react-native/no-inline-styles
                {color: props.change > 0 ? '#5cb85c' : '#d9534f'},
              ]}>
              {props.change.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoimg: {
    width: 30,
    height: 30,
    opacity: 0.9,
    justifyContent: 'center',
  },
  coinSymbol: {
    fontSize: 12,
    marginBottom: 5,
    color: Colors.lighter,
  },
  mcontainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    flex: 1.5,
  },
  coinName: {
    fontSize: 15,
    marginBottom: 2,
    fontWeight: 'bold',
    color: Colors.foreground,
  },
  price: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.foreground,
  },
  change: {
    fontSize: 13,
    textAlign: 'center',
    color: Colors.foreground,
    fontWeight: 'bold',
    marginTop: 5,
  },
  logo: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    backgroundColor: Colors.background,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  bgprice: {
    padding: 5,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  rcontainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 15,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    flex: 1,
    height: 70,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
});

export default React.memo(MarketItem);
