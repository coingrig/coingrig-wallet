import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props {
  setShow: Function;
  tokenSymbol: string;
  tokenLogo: string;
  styles: any;
}

export default React.memo(function SwapCoin({
  setShow,
  tokenSymbol,
  tokenLogo,
  styles,
}: Props) {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
      }}>
      <TouchableOpacity
        style={styles.coin}
        onPress={() => {
          setShow(true);
        }}>
        <FastImage
          style={styles.tinyLogo}
          source={{
            uri: tokenLogo,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <Text style={styles.coinText} numberOfLines={1}>
          {tokenSymbol}
        </Text>
      </TouchableOpacity>
    </View>
  );
});
