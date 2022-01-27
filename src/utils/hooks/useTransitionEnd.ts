import {useEffect, useState} from 'react';

export function useTransitionEnd(navigation) {
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
