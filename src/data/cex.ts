const CEX_LIST = [
  {
    id: 'binance',
    title: 'Binance',
    screen: 'CexDetails',
    params: true,
    image: null,
    headerImage:
      'https://public.bnbstatic.com/image/cms/blog/20220215/7dfbd14a-0f4f-4251-a3a3-74f7d5d832ce.png',
    description: 'hub.market.description',
    qr: true,
    enable: true,
    module: true,
    icon: 'https://assets.coingrig.com/images/binance-logo.png',
  },
  {
    id: 'ftx',
    title: 'FTX',
    screen: 'CexDetails',
    image: null,
    description: 'hub.market.description',
    headerImage: 'https://financialit.net/sites/default/files/binance_2.png',
    params: true,
    qr: false,
    enable: true,
    module: true,
    icon: 'https://assets.coingrig.com/images/ftx.png',
  },
  {
    id: 'coinbase',
    title: 'Coinbase',
    screen: 'CexDetails',
    image: null,
    description: 'hub.market.description',
    headerImage: 'https://financialit.net/sites/default/files/binance_2.png',
    params: true,
    qr: false,
    enable: true,
    module: true,
    icon: 'https://assets.coingrig.com/images/coinbase.jpeg',
  },
];

export default CEX_LIST;
