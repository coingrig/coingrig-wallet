import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {CoinsAvatar} from 'components/coinsAvatar';
import {formatCoins, formatPrice} from '../utils';
import {Colors} from 'utils/colors';
import {IWallet} from 'stores/wallet';
import {CryptoService} from 'services/crypto';
import {useTranslation} from 'react-i18next';

const WalletListItem = (props: {coin: IWallet; onPress?: any}) => {
  const chain = CryptoService.getSupportedChainNamebyID(props.coin.chain);
  const {t} = useTranslation();

  const external = () => {
    if (props.coin.type === 'external') {
      return (
        <View
          style={{
            width: 15,
            height: 15,
            backgroundColor: 'deeppink',
            position: 'absolute',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            borderRadius: 20,
            top: -1,
            left: -1,
          }}>
          <Text
            style={{
              color: 'white',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 10,
              paddingBottom: 2,
            }}>
            e
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <TouchableOpacity
      onPress={props.onPress ? props.onPress : null}
      style={{height: 80, marginVertical: 3}}>
      <View style={styles.container}>
        <View style={styles.card}>
          {props.coin.type === 'coin' ? (
            <View style={styles.verticalLine} />
          ) : null}
          <View style={styles.logo}>
            {external()}
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
                {(chain ? chain : t('wallet.added_manually')) + ' '}
                {chain.length < 15 && chain ? 'Network' : null}
              </Text>
            </View>
          </View>
          <View style={styles.rcontainer}>
            <Text style={styles.balance} numberOfLines={1}>
              {formatCoins(props.coin.balance) + ' ' + props.coin.symbol}
            </Text>
            <Text style={styles.value} numberOfLines={1}>
              {formatPrice(props.coin.value, true)}
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
    fontSize: 15,
    marginBottom: 0,
    // fontFamily: 'RobotoSlab-Bold',
    fontWeight: 'bold',
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
    marginHorizontal: 5,
  },
});

export default React.memo(WalletListItem);
