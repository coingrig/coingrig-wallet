/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Modal, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'utils/colors';

export default function CustomModal({show, setModalShow, children}) {
  const [visible, setVisible] = React.useState(show);

  React.useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      style={{backgroundColor: Colors.background, flex: 1}}
      onRequestClose={() => {
        setVisible(!visible);
        setModalShow(!visible);
      }}>
      <View style={{flex: 1, backgroundColor: 'black', opacity: 0.7}} />
      <View
        style={{
          height: '40%',
          width: '90%',
          backgroundColor: Colors.background,
          alignSelf: 'center',
          position: 'absolute',
          bottom: '30%',
          borderRadius: 10,
          padding: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            setModalShow(!visible);
            setVisible(!visible);
          }}
          style={{
            position: 'absolute',
            backgroundColor: Colors.background,
            width: 40,
            height: 40,
            right: 0,
            top: 0,
            zIndex: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
          }}>
          <Icon name="close" size={25} color={Colors.foreground} />
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
}
