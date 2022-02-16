import {View, Text} from 'react-native';
import React from 'react';
import {Colors} from 'utils/colors';
import CardListItem from './CardListItem';

const CardList = ({data, categorie, title}) => {
  return (
    <View
      style={{
        backgroundColor: categorie ? Colors.card : Colors.external,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 16,
      }}>
      <View style={{paddingVertical: categorie ? 16 : 0}}>
        {categorie ? (
          <Text style={{color: Colors.lighter, marginBottom: 5}}>
            {categorie.toUpperCase()}
          </Text>
        ) : null}
        {title ? (
          <Text
            style={{
              fontSize: categorie ? 22 : 19,
              fontWeight: 'bold',
              color: categorie ? Colors.foreground : Colors.lighter,
            }}>
            {title}
          </Text>
        ) : null}
      </View>
      {data.map(item => {
        return CardListItem(item);
      })}
    </View>
  );
};

export default CardList;
