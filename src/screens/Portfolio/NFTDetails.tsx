/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import {useNavigation} from '@react-navigation/native';
import {openLink} from 'utils';

const NFTScreen = props => {
  const {t} = useTranslation();
  const {item} = props.route.params;
  const navigation = useNavigation();

  return (
    <ParallaxScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      fadeOutForeground={false}
      backgroundColor={Colors.background}
      contentBackgroundColor={Colors.background}
      parallaxHeaderHeight={350}
      stickyHeaderHeight={55}
      renderFixedHeader={() => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.close}>
          <Icon name="close" size={25} color={Colors.foreground} />
        </TouchableOpacity>
      )}
      renderStickyHeader={() => <></>}
      renderForeground={() => (
        <>
          <Image
            style={styles.paraFore}
            defaultSource={require('../../assets/no-nft.png')}
            resizeMode="cover"
            source={{
              uri: item.image_url,
            }}
          />
        </>
      )}>
      <View style={styles.paraContainer}>
        <View style={styles.nftTitleCont}>
          <Text style={styles.date}>
            {t('nft.created_date') +
              ': ' +
              new Date(item.asset_contract.created_date).toDateString() ?? null}
          </Text>
          <Text style={styles.nftTitle}>{item.name}</Text>
        </View>
        <View style={{paddingHorizontal: 15}}>
          <Text style={styles.nftTitleDesc}>{t('nft.description')}</Text>
          <Text style={styles.nftDesc}>
            {item.description ?? t('nft.no_description')}
          </Text>
          <View style={{marginTop: 25, flexDirection: 'row'}}>
            <View style={styles.nftpills}>
              <Text style={{color: Colors.foreground, fontSize: 12}}>
                {t('nft.sales') + ': ' + item.num_sales}
              </Text>
            </View>
            <View style={styles.nftpills}>
              <Text style={{color: Colors.foreground, fontSize: 12}}>
                {t('nft.symbol') + ': ' + item.asset_contract.symbol}
              </Text>
            </View>
            <View style={styles.nftpills}>
              <Text style={{color: Colors.foreground, fontSize: 12}}>
                {t('nft.total_supply') +
                  ': ' +
                  (item.asset_contract.total_supply ?? '-')}
              </Text>
            </View>
          </View>
          <View
            style={[styles.nftpills, {alignSelf: 'flex-start', marginTop: 5}]}>
            <Text style={{color: Colors.foreground, fontSize: 12}}>
              {'Ethereum Network'}
            </Text>
          </View>
          {item.asset_contract.description &&
          item.asset_contract.description.length > 0 ? (
            <Text style={styles.nftDesc2}>
              {item.asset_contract.description ?? t('nft.no_description')}
            </Text>
          ) : null}
          <View style={{marginTop: 20}}>
            <TouchableOpacity
              style={styles.opensea}
              onPress={() => openLink(item.permalink)}>
              <Image
                style={styles.openseaLogo}
                source={require('assets/opensea.png')}
                resizeMode="contain"
              />
              <Text style={styles.openseaText}>OpenSea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default React.memo(NFTScreen);
