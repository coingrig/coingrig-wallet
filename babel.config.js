module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        root: ['./src'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
