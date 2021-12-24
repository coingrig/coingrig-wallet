import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon2 from 'react-native-vector-icons/Ionicons';
import apps from './apps';
import {styles} from './styles';
import {Colors} from 'utils/colors';

const HubScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
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

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => (item.enable ? navigation.navigate(item.screen) : null)}
        style={[styles.brick, {opacity: item.enable ? 1 : 0.3}]}>
        <ImageBackground
          source={item.backgroundImage}
          resizeMode="contain"
          imageStyle={{
            opacity: 0.8,
            marginBottom: 20,
            borderRadius: 500,
            backgroundColor: Colors.card,
          }}
          style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text style={styles.brickTitle} numberOfLines={1}>
            {t(item.title)}
          </Text>
          <Text style={styles.brickDesc} numberOfLines={1}>
            {t(item.description)}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={showHeader ? styles.headerShadow : null}>
        <View>
          <Text style={styles.title}>{t('Hub')} </Text>
        </View>
      </View>
      <FlatList
        data={apps}
        renderItem={renderItem}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        numColumns={2}
        keyExtractor={(item, index) => index}
        style={{padding: 10}}
      />
    </View>
  );
};

export default HubScreen;
