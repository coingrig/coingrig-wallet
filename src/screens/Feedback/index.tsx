import React, {useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';
import {SmallButton} from 'components/smallButton';
import Icon2 from 'react-native-vector-icons/Feather';
import {Colors} from 'utils/colors';
import {showMessage} from 'react-native-flash-message';
import endpoints from 'utils/endpoints';
import CONFIG from 'config';
import {Logs} from 'services/logs';
import axios from 'axios';

const FBCK_TYPE_POSITIVE = 'Positive';
const FBCK_TYPE_NEGATIVE = 'Negative';
const FBCK_TYPE_IDEA = 'Idea';

export default function LanguageScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');

  const getColor = mode => {
    if (feedbackType === mode) {
      if (feedbackType === FBCK_TYPE_POSITIVE) {
        return Colors.green;
      }
      if (feedbackType === FBCK_TYPE_IDEA) {
        return 'deeppink';
      }
      return Colors.red;
    }
    return Colors.foreground;
  };

  const sendFeedback = async () => {
    if (feedbackType === '' || message === '') {
      return showMessage({
        message: t('feedback.message.empty_form'),
        type: 'warning',
      });
    }
    navigation.goBack();
    const config = {
      method: 'post',
      url: endpoints.forms.feedback,
      headers: {
        Authorization: CONFIG.COINGRIG_KEY,
      },
      data: {
        type: feedbackType,
        message: message,
      },
    };
    let result = false;
    try {
      const response = await axios(config);
      result = response.data === 'OK';
    } catch (e) {
      Logs.info('Feedback form error', e);
    }
    if (result) {
      return showMessage({
        message: t('feedback.message.sent'),
        type: 'success',
      });
    }
    return showMessage({
      message: t('feedback.message.failed_send'),
      type: 'warning',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      //@ts-ignore
      keyboardVerticalOffset={Platform.select({
        ios: () => 50,
        android: () => 10,
      })()}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollview}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 2}}>
          <View style={styles.row}>
            <Text style={styles.subtitle}>{t('feedback.write_to_us')}</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => setFeedbackType(FBCK_TYPE_POSITIVE)}>
              <Icon2
                name="thumbs-up"
                size={27}
                style={styles.image}
                color={getColor(FBCK_TYPE_POSITIVE)}
              />
              <Text style={styles.textItem} adjustsFontSizeToFit>
                {t('feedback.i_like')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => setFeedbackType(FBCK_TYPE_NEGATIVE)}>
              <Icon2
                name="thumbs-down"
                size={27}
                style={styles.image}
                color={getColor(FBCK_TYPE_NEGATIVE)}
              />
              <Text style={styles.textItem}>{t('feedback.i_hate')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => setFeedbackType(FBCK_TYPE_IDEA)}>
              <Icon2
                name="flag"
                size={27}
                style={styles.image}
                color={getColor(FBCK_TYPE_IDEA)}
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
              scrollEnabled
              // returnKeyType="done"
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
          <View style={styles.centerRow}>
            <Text style={styles.warningText}>{t('feedback.disclaimer')}</Text>
          </View>
        </View>
        <View style={styles.bcontainer}>
          <SmallButton
            onPress={() => Linking.openURL('https://twitter.com/coingrig')}
            text="Twitter"
            color={Colors.foreground}
            style={styles.bbutton}
          />
          <SmallButton
            onPress={() => Linking.openURL('https://governance.coingrig.com/')}
            text="Governance"
            color={Colors.foreground}
            style={styles.bbutton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
