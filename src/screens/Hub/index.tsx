import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import apps from './apps';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Logs} from 'services/logs';

const HubScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [data, setData] = useState(apps);
  const [searchText, setSearchText] = useState('');
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SettingScreen')}
          style={styles.moreBtn}>
          <Icon2 name="settings-sharp" size={23} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems[0].index !== 0) {
      if (!showHeader) {
        setShowHeader(true);
      }
    } else {
      setShowHeader(false);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 90,
    waitForInteraction: true,
  };
  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);

  const renderIco = item => {
    if (item.module) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 3,
            right: 3,
            backgroundColor: Colors.background,
            borderRadius: 20,
            padding: 5,
            opacity: 0.7,
          }}>
          <Icon1 name="open-in-app" size={16} color={Colors.lighter} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            position: 'absolute',
            top: 3,
            right: 3,
            backgroundColor: Colors.background,
            borderRadius: 20,
            padding: 5,
            opacity: 0.8,
          }}>
          <Icon1 name="web" size={19} color={Colors.lighter} />
        </View>
      );
    }
  };

  const onClick = async item => {
    if (item.module) {
      navigation.navigate(item.screen);
    } else {
      try {
        if (await InAppBrowser.isAvailable()) {
          await InAppBrowser.open(item.screen, {
            dismissButtonStyle: 'cancel',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'automatic',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
            showTitle: true,
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: false,
          });
        } else {
          Linking.openURL(item.screen);
        }
      } catch (error) {
        Logs.error(error);
      }
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => (item.enable ? onClick(item) : null)}
        style={[styles.brick, {}]}>
        <ImageBackground
          source={item.backgroundImage}
          resizeMode="contain"
          imageStyle={{
            opacity: item.enable ? 0.8 : 0.15,
            marginBottom: 20,
          }}
          style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={[styles.brickTxt, {opacity: item.enable ? 1 : 0.5}]}>
            <Text style={styles.brickTitle} numberOfLines={1}>
              {t(item.title)}
            </Text>
            {/* <Text style={styles.brickDesc} numberOfLines={1}>
              {t(item.description)}
            </Text> */}
          </View>
          {renderIco(item)}
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  const searchHub = text => {
    let searchData = data;
    if (text.length === 0) {
      setData(apps);
      return;
    }
    if (text.length < searchText.length) {
      searchData = apps;
    }
    setSearchText(text);
    const newData = searchData.filter(item => {
      const itemData = `${item.title.toUpperCase()}
      ${item.description.toUpperCase()} ${item.keywords.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setData(newData);
  };

  const listHeader = () => {
    return (
      <View style={{flex: 1, marginHorizontal: 5, marginBottom: 10}}>
        <TextInput
          style={styles.search}
          autoCorrect={false}
          placeholderTextColor={'gray'}
          onChangeText={text => searchHub(text)}
          placeholder={t('hub.search')}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={showHeader ? styles.headerShadow : null}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.title}>{t('Hub')} </Text>
          <Text style={styles.subtitle}>{t('In-app Modules')} </Text>
        </View>
      </View>
      <FlatList
        data={data}
        ListHeaderComponent={listHeader()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        numColumns={2}
        //@ts-ignore
        keyExtractor={(item, index) => index}
        style={{padding: 10}}
        ListFooterComponent={() => <View style={{height: 30}} />}
      />
    </View>
  );
};

export default HubScreen;
