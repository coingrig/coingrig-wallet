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
    description: 'portfolio.categories.crypto',
    enable: true,
  },
  {
    title: 'NFTs',
    component: NFTs,
    description: 'portfolio.categories.nfts',
    enable: true,
  },
  {
    title: 'CEXs',
    component: CEXs,
    description: 'portfolio.categories.cexs',
    enable: true,
  },
  {
    title: 'Banks',
    component: Banking,
    description: 'portfolio.categories.banks',
    enable: true,
  },
  {
    title: 'Stocks',
    component: Stocks,
    description: 'portfolio.categories.stocks',
    enable: true,
  },
  {
    title: 'Cash',
    component: Fiat,
    description: 'portfolio.categories.cash',
    enable: true,
  },
];

export default Portfolios;
