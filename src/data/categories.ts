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
    title: 'hub.category.featured',
    component: Featured,
    enable: true,
  },
  {
    title: 'hub.category.market',
    component: MarketTab,
    enable: true,
  },
  {
    title: 'hub.category.defi',
    component: Defi,
    enable: true,
  },
  {
    title: 'hub.category.tools',
    component: Tools,
    enable: true,
  },
  {
    title: 'hub.category.connectors',
    component: Connectors,
    enable: true,
  },
  {
    title: 'hub.category.card',
    component: Card,
    enable: true,
  },
  {
    title: 'hub.category.shops',
    component: Shops,
    enable: true,
  },
  {
    title: 'hub.category.dapps',
    component: DApps,
    enable: true,
  },
  {
    title: 'hub.category.games',
    component: Games,
    enable: true,
  },
];

export default HubCatgories;
