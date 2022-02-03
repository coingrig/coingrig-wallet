import React from 'react';
import {View, Alert, Modal} from 'react-native';
import {Colors} from 'utils/colors';

export default function CustomModal({show}) {
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
        Alert.alert('Modal has been closed.');
        setVisible(!visible);
      }}>
      <View style={{flex: 1, backgroundColor: 'black', opacity: 0.7}} />
      <View
        style={{
          height: '50%',
          width: '90%',
          backgroundColor: Colors.background,
          justifyContent: 'center',
          alignSelf: 'center',
          alignContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: '25%',
          borderRadius: 10,
        }}
      />
    </Modal>
  );
}
