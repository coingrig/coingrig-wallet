import {useEffect, useState} from 'react';

export function TransitionEnd(navigation) {
  const [end, setEnd] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', d => {
      if (!d.data.closing) {
        setEnd(true);
      }
    });

    return unsubscribe;
  }, [navigation]);

  return end;
}

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
