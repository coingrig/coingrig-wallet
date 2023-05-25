
# 🅒🅖🅦 Coingrig Mobile Wallet
Next-Generation Digital Wallet. A powerful digital wallet for everyone with unique features.

🪙 Crypto, 🏦 Banking, 📈 Stocks and more.

📱 You can install the app from AppStore and Google Play.

Website: [coingrig.com](https://coingrig.com)



### Building Locally

The code is built using React-Native.

-   Install [Node.js](https://nodejs.org)

    -   If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.

-   Install the shared [React Native dependencies](https://reactnative.dev/docs/environment-setup#installing-dependencies) (`React Native CLI`, _not_ `Expo CLI`)

-   Install [cocoapods](https://guides.cocoapods.org/using/getting-started.html) by running:

```bash
sudo gem install cocoapods
```

-   Clone this repo and install our dependencies:

```bash
git clone https://github.com/coingrig/coingrig-wallet
cd coingrig-wallet
yarn # this will install all dependecies
cd ios && pod install && cd .. # install pods for iOS
```
#### Android

-   Install the Android SDK, via [Android Studio](https://developer.android.com/studio).
-   Install the correct emulator
    -   Follow the instructions at:
        -   [React Native Getting Started - Android](https://reactnative.dev/docs/environment-setup#installing-dependencies) _(React Native CLI Quickstart -> [your OS] -> Android)_
        -   More details can be found [on the Android Developer site](https://developer.android.com/studio/run/emulator)
-   Finally, start the emulator from Android Studio, and run:

```bash
npx react-native run-android
```

#### iOS

-   Install the iOS dependencies
    -   [React Native Getting Started - iOS](https://reactnative.dev/docs/environment-setup#installing-dependencies) _(React Native CLI Quickstart -> [your OS] -> iOS)_
-   Install the correct simulator
```bash
npx react-native run-ios
```

* * *

## Code of Conduct

This library has adopted a Code of Conduct that we expect project participants to adhere to. Please read the [full text](CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.



## License

The Coingrig Wallet is licensed under the MIT [License](LICENSE).

Follow us on [Twitter](https://twitter.com/coingrig)

[coingrig.com](https://coingrig.com)
