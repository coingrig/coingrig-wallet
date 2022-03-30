module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react/jsx-no-literals': [
      1,
      {
        noStrings: true,
        ignoreProps: true,
      },
    ],
    'prefer-const': 'warn',
  },
};
