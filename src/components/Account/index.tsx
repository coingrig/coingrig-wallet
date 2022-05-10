/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import UserAvatar from 'react-native-user-avatar';
import {capitalizeFirstLetter} from 'utils';

const AccountItem = (props: {
  img: string | null;
  disable: boolean;
  title: string;
  subtitle: string;
  value: string;
  subvalue: string;
  subimg: string | null;
  onPress?: any;
  showAvatar: boolean | null;
}) => {
  const renderImg = () => {
    if (props.subimg) {
      return (
        <>
          <FastImage
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              borderRadius: 50,
              backgroundColor: 'white',
              position: 'absolute',
              zIndex: 10,
              top: -3,
              left: 0,
              borderWidth: 1,
              borderColor: Colors.darker,
            }}
            source={{
              uri: props.subimg || '',
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
          />
          <FastImage
            style={{
              width: 30,
              height: 30,
              justifyContent: 'center',
              borderRadius: 50,
              backgroundColor: Colors.darker,
            }}
            source={{
              uri: props.img || '',
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
          />
        </>
      );
    } else {
      return (
        <FastImage
          style={{
            width: 30,
            height: 30,
            justifyContent: 'center',
            borderRadius: 50,
            backgroundColor: Colors.darker,
          }}
          source={{
            uri: props.img || '',
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={props.onPress ? props.onPress : null}
      disabled={props.disable}
      style={{height: 80, marginVertical: 3}}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logo}>
            {props.img ? (
              renderImg()
            ) : props.showAvatar ? (
              <UserAvatar size={30} name={props.title} />
            ) : null}
          </View>
          <View style={styles.mcontainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.coinName,
                {fontWeight: props.subtitle ? 'bold' : 'normal'},
              ]}>
              {props.title}
            </Text>
            {props.subtitle ? (
              <View>
                <Text style={styles.coinSymbol} numberOfLines={1}>
                  {props.subtitle}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.rcontainer}>
            <Text style={styles.balance} numberOfLines={1} adjustsFontSizeToFit>
              {props.value}
            </Text>
            <Text style={styles.value} numberOfLines={1}>
              {capitalizeFirstLetter(props.subvalue.toLowerCase())}
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
    fontSize: 14,
    textAlign: 'right',
    fontWeight: 'bold',
    color: Colors.foreground,
    marginRight: 5,
  },
  value: {
    fontSize: 12,
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

export default React.memo(AccountItem);
