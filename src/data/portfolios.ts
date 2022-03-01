import Banking from 'screens/Portfolio/Banking';
import CEXs from 'screens/Portfolio/CEXs';
import Crypto from 'screens/Portfolio/Crypto';
import NFTs from 'screens/Portfolio/NFTs';
import Stocks from 'screens/Portfolio/Stocks';

const Portfolios = [
  {
    title: 'Crypto',
    component: Crypto,
    enable: true,
  },
  {
    title: 'NFTs',
    component: NFTs,
    enable: true,
  },
  {
    title: 'CEXs',
    component: CEXs,
    enable: true,
  },
  {
    title: 'Banking',
    component: Banking,
    enable: true,
  },
  {
    title: 'Stocks',
    component: Stocks,
    enable: true,
  },
];

export default Portfolios;
