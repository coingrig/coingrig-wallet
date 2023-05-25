/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from 'utils/colors';
import endpoints from 'utils/endpoints';
import FastImage from 'react-native-fast-image';
import {formatPrice, openLink} from 'utils';

export default function TwoBricks({
  symbol1,
  symbol2,
  title1,
  title2,
  image1,
  image2,
  value1,
  value2,
  subValue1,
  subValue2,
}) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
      }}>
      <TouchableOpacity
        disabled
        onPress={() =>
          openLink(
            symbol1 === 'CL=F' || symbol1 === 'GC=F'
              ? endpoints.yahoofinance + symbol1
              : endpoints.googlefinance + symbol1,
          )
        }
        style={{
          backgroundColor: Colors.card,
          flexGrow: 1,
          borderRadius: 10,
          justifyContent: 'center',
          padding: 15,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FastImage
            style={{width: 16, height: 16, borderRadius: 100}}
            source={{
              uri: image1,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              marginLeft: 10,
              color: Colors.foreground,
              fontWeight: 'bold',
            }}>
            {title1}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{fontSize: 14, marginTop: 5, color: Colors.lighter}}
            numberOfLines={1}
            allowFontScaling
            adjustsFontSizeToFit>
            {formatPrice(value1)}
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginTop: 5,
              textAlign: 'right',
              color: subValue1.startsWith('-') ? Colors.red : Colors.green,
              marginLeft: 10,
            }}
            numberOfLines={1}
            allowFontScaling
            adjustsFontSizeToFit>
            {subValue1}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        disabled
        onPress={() =>
          openLink(
            symbol2 === 'CL=F' || symbol2 === 'GC=F'
              ? endpoints.yahoofinance + symbol2
              : endpoints.googlefinance + symbol2,
          )
        }
        style={{
          backgroundColor: Colors.card,
          flexGrow: 1,
          borderRadius: 10,
          justifyContent: 'center',
          padding: 15,
          marginLeft: 5,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FastImage
            style={{width: 16, height: 16, borderRadius: 100}}
            source={{
              uri: image2,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              marginLeft: 10,
              color: Colors.foreground,
              fontWeight: 'bold',
            }}>
            {title2}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{fontSize: 14, marginTop: 5, color: Colors.lighter}}
            numberOfLines={1}
            allowFontScaling
            adjustsFontSizeToFit>
            {formatPrice(value2)}
          </Text>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'right',
              marginTop: 5,
              color: subValue2.startsWith('-') ? Colors.red : Colors.green,
              marginLeft: 10,
            }}
            numberOfLines={1}
            allowFontScaling
            adjustsFontSizeToFit>
            {subValue2}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
