import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {CoinsAvatar} from 'components/coinsAvatar';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {WalletStore} from 'stores/wallet';
import {formatCoins, formatPrice} from 'utils';
import {Colors} from 'utils/colors';

const Brick = observer((props: any) => {
  const [name, setName] = React.useState('-');
  const color = Colors.brick;
  const navigation = useNavigation();
  const {t} = useTranslation();
  const wallet = WalletStore.getWalletByCoinId(props.coin, props.chain);
  React.useEffect(() => {
    setName(wallet?.name!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderBody = () => {
    if (props.coin !== '_END_') {
      return (
        <>
          <Text adjustsFontSizeToFit numberOfLines={2} style={styles.coinName}>
            {name}
          </Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.dollar}>
            {formatPrice(wallet?.value, true) || 0}
          </Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.coinValue}>
            {formatCoins(wallet?.balance) || 0} {props.coin}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[
              styles.coinName,
              // eslint-disable-next-line react-native/no-inline-styles
              {color: Colors.background, marginBottom: 10},
            ]}>
            {t('bricks.all_wallets')}
          </Text>
          <Text adjustsFontSizeToFit numberOfLines={2} style={styles.endBrick}>
            {t('bricks.check_portfolio')}
          </Text>
        </>
      );
    }
  };
  return (
    <TouchableOpacity
      style={[
        styles.brick,
        {
          backgroundColor: props.coin === '_END_' ? Colors.brickEnd : color,
        },
      ]}
      onPress={() =>
        props.coin !== '_END_'
          ? navigation.navigate('WalletScreen', {
              coin: name.toLowerCase(),
              symbol: props.coin,
              chain: props.chain,
            })
          : navigation.navigate('PortfolioScreen')
      }>
      <View style={styles.container}>
        <View style={styles.tcontainer}>
          <View style={styles.logo}>
            <CoinsAvatar
              style={styles.logoimg}
              coin={props.coin}
              source={wallet?.image}
            />
          </View>
        </View>
        <View style={styles.bcontainer}>{renderBody()}</View>
      </View>
      <Svg viewBox="0 0 400 150" preserveAspectRatio="none" style={styles.svg}>
        <Path
          d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
          fill={Colors.wave}
          opacity="0.5"
        />
      </Svg>
    </TouchableOpacity>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  logoimg: {
    width: 30,
    height: 30,
    opacity: 0.9,
  },
  dollar: {
    fontSize: 17,
    marginBottom: 2,
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
    fontSize: 12,
    marginBottom: 15,
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
  bcontainer: {justifyContent: 'flex-end', margin: 10, marginBottom: 20},
  logo: {
    width: 45,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  coinName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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

export default React.memo(Brick);
