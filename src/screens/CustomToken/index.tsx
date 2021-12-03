import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {styles} from './styles';
import {Logs} from 'services/logs';
import {Colors} from 'utils/colors';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export default function CustomTokenScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [selectedChain, setSelectedChain] = React.useState('Select Network');
  const [token, setToken] = React.useState<string>('');

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setToken(text);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <View style={styles.inputView}>
          <Menu style={styles.chain}>
            <MenuTrigger text={selectedChain} customStyles={triggerStyles} />
            <MenuOptions customStyles={optionsStyles}>
              <MenuOption
                onSelect={() => setSelectedChain('Ethereum')}
                text="Ethereum"
                customStyles={optionStyles}
              />
              <MenuOption
                onSelect={() => setSelectedChain('Binance Smart Chain')}
                text="Binance Smart Chain"
                customStyles={optionStyles}
              />
              <MenuOption
                onSelect={() => setSelectedChain('Polygon')}
                text="Polygon"
                customStyles={optionStyles}
              />
            </MenuOptions>
          </Menu>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            onChangeText={v => setToken(v)}
            value={token}
            placeholder={t('customtoken.token')}
            numberOfLines={1}
            returnKeyType="done"
            placeholderTextColor={Colors.foreground}
            autoCompleteType={'off'}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => fetchCopiedText()}
            style={styles.moreBtn}>
            <Icon name="content-paste" size={20} color={Colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const triggerStyles = {
  triggerText: {
    color: Colors.foreground,
  },
  triggerOuterWrapper: {},
  triggerWrapper: {
    height: 30,
    justifyContent: 'center',
  },
};
const optionsStyles = {
  optionsContainer: {
    backgroundColor: Colors.darker,
    padding: 5,
  },
  optionText: {
    color: Colors.foreground,
  },
};

const optionStyles = {
  optionText: {
    color: Colors.foreground,
    padding: 10,
  },
};
