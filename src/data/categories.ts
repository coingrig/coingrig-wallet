import Card from 'screens/Hub/Card';
import DApps from 'screens/Hub/DApps';
import Defi from 'screens/Hub/Defi';
// import Games from 'screens/Hub/Games';
import Shops from 'screens/Hub/Shops';
import Tools from 'screens/Hub/Tools';
import Featured from '../screens/Hub/Featured';
import MarketTab from '../screens/Hub/Market';

const HubCatgories = [
  {
    title: 'Featured',
    description: 'hub.category.featured',
    component: Featured,
    enable: true,
  },
  {
    title: 'Market',
    description: 'hub.category.market',
    component: MarketTab,
    enable: true,
  },
  {
    title: 'Defi',
    description: 'hub.category.defi',
    component: Defi,
    enable: true,
  },
  {
    title: 'Tools',
    description: 'hub.category.tools',
    component: Tools,
    enable: true,
  },
  {
    title: 'DApps',
    description: 'hub.category.dapps',
    component: DApps,
    enable: true,
  },
  {
    title: 'Card',
    description: 'hub.category.card',
    component: Card,
    enable: true,
  },
  {
    title: 'Shops',
    description: 'hub.category.shops',
    component: Shops,
    enable: true,
  },
  // {
  //   title: 'Games',
  //   description: 'hub.category.games',
  //   component: Games,
  //   enable: true,
  // },
];

export default HubCatgories;
