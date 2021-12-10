import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'utils/colors';
import {styles} from './style';

const SwapScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.swapContainer}>
        <View style={styles.swapItem}>
          <View>
            <Text style={styles.youPay}>You pay</Text>
            <Text style={styles.amount}>100000</Text>
          </View>
          <View>
            <View style={styles.coin}>
              <Image
                style={styles.tinyLogo}
                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
              />
              <Text style={styles.coinText}>BNB</Text>
            </View>
          </View>
        </View>

        <View style={styles.connector}>
          <Icon name="swap-vertical" size={25} color={Colors.foreground} />
        </View>

        <View style={styles.swapItem}>
          <View>
            <Text style={styles.youPay}>You pay</Text>
            <Text style={styles.amount}>100000</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.coin}>
              <Image
                style={styles.tinyLogo}
                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
              />
              <Text style={styles.coinText}>BNBAD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SwapScreen;
