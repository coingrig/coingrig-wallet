import {LogBox} from 'react-native';
import {logger, consoleTransport} from 'react-native-logs';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const defaultConfig = {
  enabled: __DEV__,
  transport: consoleTransport,
  transportOptions: {
    colors: 'ansi',
  },
};
export const Logs = logger.createLogger(defaultConfig);
