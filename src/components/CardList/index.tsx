import {View, Text} from 'react-native';
import React from 'react';
import {Colors} from 'utils/colors';
import CardListItem from './CardListItem';

const CardList = ({data, category, title}) => {
  return (
    <View
      style={{
        backgroundColor: category ? Colors.card : Colors.external,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 16,
      }}>
      <View style={{paddingVertical: category ? 16 : 0}}>
        {category ? (
          <Text style={{color: Colors.lighter, marginBottom: 5}}>
            {category.toUpperCase()}
          </Text>
        ) : null}
        {title ? (
          <Text
            style={{
              fontSize: category ? 22 : 19,
              fontWeight: 'bold',
              color: category ? Colors.foreground : Colors.lighter,
            }}>
            {title}
          </Text>
        ) : null}
      </View>
      {data.map((item, index) => {
        return CardListItem(item, index === data.length - 1);
      })}
    </View>
  );
};

export default CardList;
