/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import NFTCard from 'components/NFT/Card';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../styles';
import BigList from 'react-native-big-list';
import endpoints from 'utils/endpoints';
import {CryptoService} from 'services/crypto';
import {SIZE} from 'utils/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'utils/colors';

const NFTs = observer(() => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [nfts, setNFTs] = useState<any[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SendReceiveScreen', {
              coin: 'ETH',
              chain: 'ETH',
              name: 'Ethereum',
              receive: true,
              nft: true,
            });
          }}
          style={styles.moreBtn}>
          <Icon name="download" size={25} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    // eslint-disable-next-line no-shadow
    const NFTList: any = await CryptoService.getNFTs();
    setNFTs(NFTList);
  };

  const renderNFTs = ({item}) => {
    if (
      item.image_url === null ||
      item.image_url === '' ||
      item.image_url.includes('svg')
    ) {
      item.image_url = endpoints.assets + '/images/no-nft.png';
    }
    return <NFTCard item={item} />;
  };
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{t('portfolio.my_nfts')}</Text>
        <Text style={styles.subRight}>{t('Ethereum')}</Text>
      </View>
    );
  };

  const renderList = () => {
    if (nfts.length > 0) {
      return (
        <BigList
          data={nfts}
          renderItem={renderNFTs}
          itemHeight={200}
          insetBottom={30}
          headerHeight={40}
          renderHeader={listHeader}
          numColumns={2}
          style={{marginHorizontal: 10}}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item.id.toString() ?? ''}
        />
      );
    } else {
      return (
        <View
          style={{
            marginHorizontal: 16,
            flexGrow: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 150,
              width: '100%',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              opacity: 0.2,
            }}>
            <Icon name="images-outline" size={120} color={'gray'} />
          </View>
          <Text
            style={{
              fontSize: 21,
              color: 'gray',
              textAlign: 'center',
              fontWeight: 'bold',
              opacity: 0.2,
              height: 50,
            }}>
            {t('portfolio.empty_your_nfts')}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={{flexGrow: 1}}>
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          flexGrow: 1,
          height: nfts.length > 0 ? 100 * nfts.length + 70 : SIZE.height / 1.5,
        }}>
        {renderList()}
      </View>
    </View>
  );
});

export default NFTs;
