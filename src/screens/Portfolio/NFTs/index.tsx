/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import NFTCard from 'components/NFT/Card';
import {FlatList, Image, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import WalletListItem from 'components/walletlistitem';
import {ScrollView} from 'react-native-gesture-handler';
import {IWallet, WalletStore} from 'stores/wallet';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice} from 'utils';
import BigList from 'react-native-big-list';
import endpoints from 'utils/endpoints';
import {CryptoService} from 'services/crypto';

const NFTs = observer(() => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [nfts, setNFTs] = useState<any[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
    });
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    // eslint-disable-next-line no-shadow
    const NFTList: any = await CryptoService.getNFTs();
    setNFTs(NFTList);
  };

  const renderNFTs = ({item}) => {
    // console.log(item.image_url);
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
          headerHeight={50}
          renderHeader={listHeader}
          numColumns={2}
          style={{marginHorizontal: 10}}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item.id.toString() ?? ''}
          scrollEventThrottle={100}
        />
      );
    } else {
      return (
        <View style={styles.nonft}>
          <Image
            style={styles.noNftImg}
            source={require('assets/nft.png')}
            resizeMode="contain"
          />
        </View>
      );
    }
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{justifyContent: 'center', flex: 1}}>{renderList()}</View>
    </View>
  );
});

export default NFTs;
