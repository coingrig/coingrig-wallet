import {ScrollView, View} from 'react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import CardList from 'components/CardList';
import {styles} from './styles';
import CEX_LIST from 'data/cex';
import Separator from 'components/CardList/Separator';
import {ILogEvents, LogEvents} from 'utils/analytics';
import i18n from 'i18n';

export default function CEXScreen() {
  const {t} = useTranslation();

  const cexList = CEX_LIST.map(o => {
    o.description = i18n.t('portfolio.cexs.connect_to') + ' ' + o.title;
    return o;
  });

  useEffect(() => {
    LogEvents(ILogEvents.SCREEN, 'CEXList');
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      <View style={{marginHorizontal: 16}}>
        <Separator title={t('portfolio.cexs.accounts').toUpperCase()} />
        <CardList
          data={cexList.filter(item => item.enable === true)}
          title={null}
          category={null}
        />
        <Separator title={t('dashboard.coming_soon').toUpperCase()} />
        <CardList
          data={cexList.filter(item => item.enable === false)}
          title={null}
          category={null}
        />
      </View>
    </ScrollView>
  );
}
