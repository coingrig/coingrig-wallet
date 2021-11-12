import {logger, consoleTransport} from 'react-native-logs';

const defaultConfig = {
  enabled: __DEV__,
  transport: consoleTransport,
  transportOptions: {
    colors: 'ansi',
  },
};
export const Logs = logger.createLogger(defaultConfig);
