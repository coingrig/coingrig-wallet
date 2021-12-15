import React, {useEffect} from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';
import {Colors} from 'utils/colors';
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
            <Icon name="language" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('language.english')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setLanguage('fr')}>
            <Icon name="language" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('language.french')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setLanguage('ro')}>
            <Icon name="language" size={23} color={Colors.foreground} />
            <Text style={styles.textItem}>{t('language.romanian')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
