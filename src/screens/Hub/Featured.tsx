import {ScrollView} from 'react-native';
import React from 'react';
import apps from '../../data/apps';
import {useTranslation} from 'react-i18next';
import CardList from 'components/CardList';
import CardImage from 'components/CardImage';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';

export default function Featured() {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      <CardImage
        //@ts-ignore
        onClick={() => navigation.navigate('SwapScreen')}
        imageURI={'https://coingrig.com/images/assets/coinsi.png'}
        category={'INFO'}
        title={'Connected to 30 DEXs'}
        //Conectat la 30 DEX-uri
        //Connecté à 30 DEXs
        desc={
          'Coingrig Swap can query and use multiple DEXs to find the swap with the best price for you.'
          // Coingrig Swap peut interroger et utiliser plusieurs DEX pour trouver le swap avec le meilleur prix pour vous.
          // Coingrig Swap poate interoga și utiliza mai multe DEX-uri pentru a găsi schimbul cu cel mai bun preț pentru tine.
        }
      />
      <CardList
        data={apps.filter(app => app.categories?.includes('featured'))}
        title={t('Shortcuts for your needs')}
        category={t('SHORTCUTS')}
      />
    </ScrollView>
  );
}

// Shortcuts for your needs
// Des raccourcis adaptés à vos besoins
// Comenzi rapide pentru nevoile dvs
