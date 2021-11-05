import './shim';
import './src/config';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import i18n from './src/i18n';

AppRegistry.registerComponent(appName, () => App);
