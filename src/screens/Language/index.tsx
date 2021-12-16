import React, {useEffect} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';
import {StorageSetItem} from 'services/storage';

export default function LanguageScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {}, []);

  const setLanguage = async lng => {
    i18n.changeLanguage(lng);
    await StorageSetItem('@lng', lng, false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollview}
        showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.subtitle}>{t('language.choose_language')}</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setLanguage('en')}>
            <Image
              style={{height: 25, width: 25}}
              resizeMode="contain"
              source={require('../../assets/countries/usa.png')}
            />
            <Text style={styles.textItem}>{t('language.english')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setLanguage('fr')}>
            <Image
              style={{height: 25, width: 25}}
              resizeMode="contain"
              source={require('../../assets/countries/france.png')}
            />
            <Text style={styles.textItem}>{t('language.french')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setLanguage('ro')}>
            <Image
              style={{height: 25, width: 25}}
              resizeMode="contain"
              source={require('../../assets/countries/romania.png')}
            />
            <Text style={styles.textItem}>{t('language.romanian')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
