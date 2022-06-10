import {Logs} from 'services/logs';

export const importFriend = url => {
  try {
    Logs.info(url);
  } catch (error) {
    Logs.error(error);
  }
};

export const exportMyContact = () => {
  try {
    Logs.info('export');
  } catch (error) {
    Logs.error(error);
  }
};
