/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {Colors} from 'utils/colors';
import CardListItem from './CardListItem';
import {styles} from './styles';

const CardList = ({data, category, title}) => {
  return (
    <View style={[styles.list, {backgroundColor: Colors.card}]}>
      <View style={{paddingVertical: category ? 16 : 0}}>
        {category ? (
          <Text style={{color: Colors.lighter, marginBottom: 5, fontSize: 14}}>
            {category.toUpperCase()}
          </Text>
        ) : null}
        {title ? (
          <Text
            style={[
              styles.listTitle,
              {
                color: category ? Colors.foreground : Colors.lighter,
                fontSize: category ? 22 : 19,
              },
            ]}>
            {title}
          </Text>
        ) : null}
      </View>
      {data.map((item, index) => {
        return CardListItem(item, index, index === data.length - 1);
      })}
    </View>
  );
};

export default CardList;
