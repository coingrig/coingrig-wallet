import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import {Colors} from 'utils/colors';
import {useNavigation} from '@react-navigation/native';
import {BankStore} from 'stores/bankStore';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

const BankingScreen = observer(({route}) => {
  const navigation = useNavigation();
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => null}
        style={{
          flexDirection: 'row',
          paddingVertical: 20,
          alignItems: 'center',
        }}>
        <FastImage
          style={{width: 45, height: 30}}
          resizeMode="contain"
          source={{
            uri: item.bankLogo,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <Text style={{marginHorizontal: 10, flex: 1}}>{item.bankName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={async () => {
          navigation.navigate('SelectCountryScreen');
        }}
        style={{margin: 5, padding: 10, backgroundColor: Colors.card}}>
        <Text>Add bank</Text>
      </TouchableOpacity>
      {BankStore.bankAccounts.length > 0 ? (
        <FlatList
          data={BankStore.bankAccounts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{height: 1, backgroundColor: Colors.border}} />
          )}
          style={{
            paddingHorizontal: 16,
          }}
          ListHeaderComponent={null}
          ListFooterComponent={() => <View style={{height: 30}} />}
        />
      ) : null}
    </View>
  );
});

export default BankingScreen;
