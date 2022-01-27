import {useEffect} from 'react';

export function ScreenEvents(navigation) {
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      return true;
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      return false;
    });

    () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);
}
