import Card from 'screens/Hub/Card';
import Connectors from 'screens/Hub/Connectors';
import DApps from 'screens/Hub/DApps';
import Defi from 'screens/Hub/Defi';
import Games from 'screens/Hub/Games';
import Shops from 'screens/Hub/Shops';
import Tools from 'screens/Hub/Tools';
import Featured from '../screens/Hub/Featured';
import MarketTab from '../screens/Hub/Market';

const HubCatgories = [
  {
    title: 'Featured',
    component: Featured,
    enable: true,
  },
  {
    title: 'Market',
    component: MarketTab,
    enable: true,
  },
  {
    title: 'Defi',
    component: Defi,
    enable: true,
  },
  {
    title: 'Tools',
    component: Tools,
    enable: true,
  },
  {
    title: 'Connectors',
    component: Connectors,
    enable: true,
  },
  {
    title: 'Card',
    component: Card,
    enable: true,
  },
  {
    title: 'Shops',
    component: Shops,
    enable: true,
  },
  {
    title: 'DApps',
    component: DApps,
    enable: true,
  },
  {
    title: 'Games',
    component: Games,
    enable: true,
  },
];

export default HubCatgories;
