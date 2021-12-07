import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CoinsAvatar} from 'components/coinsAvatar';
import {formatCoins} from '../../utils';
import {Colors} from 'utils/colors';
import {CryptoService} from 'services/crypto';

const TokenPreview = props => {
  const chain = CryptoService.getSupportedChainNamebyID(props.coin.chain);
  return (
    <View style={{height: 80, marginVertical: 4}}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logo}>
            <CoinsAvatar
              style={styles.logoimg}
              coin={props.coin.symbol}
              source={props.coin.image}
            />
          </View>
          <View style={styles.mcontainer}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={2}
              style={styles.coinName}>
              {props.coin.name}
            </Text>
            <View>
              <Text style={styles.coinSymbol} numberOfLines={1}>
                {chain + ' '}
                {chain.length < 15 ? 'Network' : null}
              </Text>
            </View>
          </View>
          <View style={styles.rcontainer}>
            <Text style={styles.balance} numberOfLines={1}>
              {formatCoins(props.coin.balance) + ' ' + props.coin.symbol}
            </Text>
          </View>
        </View>
      </View>
    </View>
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
    marginTop: 3,
    color: Colors.lighter,
  },
  chart: {
    paddingRight: 0,
    paddingBottom: 20,
    paddingTop: 20,
  },
  mcontainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    flex: 1.5,
    // backgroundColor: 'red',
  },
  verticalLine: {
    backgroundColor: '#EDE2C1',
    width: 2,
    height: 50,
    position: 'absolute',
    left: 0,
    top: 15,
    borderRadius: 10,
  },
  chartContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 0,
    flex: 1,
  },
  coinName: {
    fontSize: 16,
    marginBottom: 0,
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
  },
  balance: {
    fontSize: 13,
    textAlign: 'right',
    fontWeight: 'bold',
    color: Colors.foreground,
    marginRight: 5,
  },
  value: {
    fontSize: 13,
    textAlign: 'right',
    color: Colors.lighter,
    marginTop: 5,
    marginRight: 5,
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
    // backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 5,
  },
  rcontainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 5,
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

export default React.memo(TokenPreview);
