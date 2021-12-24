const apps = [
  {
    title: 'market.market',
    description: 'hub.market.descripton',
    screen: 'MarketScreen',
    backgroundImage: require('../../assets/hub/market.png'),
    enable: true,
  },
  {
    title: 'title.news',
    description: 'hub.news.description',
    screen: 'NewsScreen',
    backgroundImage: require('../../assets/hub/news.png'),
    enable: true,
  },
  {
    title: 'settings.walletconnect',
    description: 'hub.walletconnect.description',
    screen: 'WalletconnectScreen',
    backgroundImage: require('../../assets/hub/wc.png'),
    enable: true,
  },
  {
    title: 'Swap',
    screen: 'SwapScreen',
    backgroundImage: require('../../assets/hub/swap.png'),
    description: 'dashboard.coming_soon',
    enable: false,
  },
  {
    title: 'Portfolio tracker',
    screen: 'NewsScreen',
    backgroundImage: require('../../assets/hub/track.png'),
    description: 'dashboard.coming_soon',
    enable: false,
  },
  {
    title: 'Create token',
    screen: 'NewsScreen',
    backgroundImage: require('../../assets/hub/token.png'),
    description: 'dashboard.coming_soon',
    enable: false,
  },
  {
    title: 'Create NFT',
    screen: 'NewsScreen',
    backgroundImage: require('../../assets/hub/nft.png'),
    description: 'dashboard.coming_soon',
    enable: false,
  },
];

export default apps;
