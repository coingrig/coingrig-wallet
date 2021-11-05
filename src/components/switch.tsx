import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Colors} from 'utils/colors';

export function Switch(props) {
  const [receive, setReceive] = useState(props.receive);
  const {t} = useTranslation();

  const switchMe = v => {
    setReceive(v);
    props.switcher(v);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={receive ? styles.switchBtn : styles.switchBtnOff}
        onPress={() => switchMe(true)}>
        <Text style={receive ? styles.switchTxt : styles.switchTxtOff}>
          {t('tx.receive')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={receive ? styles.switchBtnOff : styles.switchBtn}
        onPress={() => switchMe(false)}>
        <Text style={receive ? styles.switchTxtOff : styles.switchTxt}>
          {t('tx.send')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 35,
    backgroundColor: Colors.switchBackground,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  switchTxt: {
    fontSize: 14,
    color: Colors.switchBackground,
    fontFamily: 'RobotoSlab-Bold',
  },
  switchTxtOff: {
    fontSize: 14,
    color: Colors.background,
    fontFamily: 'RobotoSlab-Bold',
  },
  switchBtn: {
    backgroundColor: Colors.switchForeground,
    flex: 1,
    margin: 3,
    alignItems: 'center',
    height: '90%',
    borderRadius: 8,
    justifyContent: 'center',
  },
  switchBtnOff: {
    backgroundColor: Colors.switchBackground,
    flex: 1,
    margin: 3,
    alignItems: 'center',
    height: '90%',
    borderRadius: 5,
    justifyContent: 'center',
  },
});
