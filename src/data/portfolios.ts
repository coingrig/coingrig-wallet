import Banking from 'screens/Portfolio/Banking';
import CEXs from 'screens/Portfolio/CEXs';
import Crypto from 'screens/Portfolio/Crypto';
import Fiat from 'screens/Portfolio/Fiat';
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
    title: 'Banks',
    component: Banking,
    enable: true,
  },
  {
    title: 'Stocks',
    component: Stocks,
    enable: true,
  },
  {
    title: 'Cash',
    component: Fiat,
    enable: true,
  },
];

export default Portfolios;
