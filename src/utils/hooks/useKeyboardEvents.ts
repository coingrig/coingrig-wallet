import {Keyboard} from 'react-native';
import {useEffect} from 'react';

export default function useKeyboardEvents(onKeyboardShow, onKeyboardHide) {
  useEffect(() => {
    const keyboardShow = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardShow,
    );
    const keyboardHide = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardHide,
    );

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, [onKeyboardShow, onKeyboardHide]);
}
