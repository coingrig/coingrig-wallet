import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';
import {SmallButton} from 'components/smallButton';
import Icon2 from 'react-native-vector-icons/Feather';
import {Colors} from 'utils/colors';
import {showMessage} from 'react-native-flash-message';

export default function LanguageScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {}, []);

  let getColor = mode => {
    console.log(feedbackType);
    if (feedbackType === mode) {
      return 'blue';
    }
    return Colors.foreground;
  };

  let sendFeedback = () => {
    navigation.goBack();
    showMessage({
      message: t('feedback.message.sent'),
      type: 'success',
    });
    return;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollview}
        showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <Text style={styles.subtitle}>{t('feedback.write_to_us')}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setFeedbackType('up')}>
            <Icon2
              name="thumbs-up"
              size={30}
              style={styles.image}
              color={getColor('up')}
            />
            <Text style={styles.textItem}>{t('feedback.i_like')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setFeedbackType('down')}>
            <Icon2
              name="thumbs-down"
              size={30}
              style={styles.image}
              color={getColor('down')}
            />
            <Text style={styles.textItem}>{t('feedback.i_hate')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setFeedbackType('idea')}>
            <Icon2
              name="flag"
              size={30}
              style={styles.image}
              color={getColor('idea')}
            />
            <Text style={styles.textItem}>{t('feedback.i_want')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.textInput}
            editable={true}
            placeholder={t('feedback.your_feedback_here')}
            numberOfLines={4}
            returnKeyType="done"
            placeholderTextColor="gray"
            multiline
            value={message}
            onChangeText={text => setMessage(text)}
          />
        </View>
        <View style={styles.centerRow}>
          <SmallButton
            text={t('feedback.submit')}
            onPress={() => {
              sendFeedback();
            }}
            color="#f2eded"
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}
