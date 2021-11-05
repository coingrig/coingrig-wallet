import {action, makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import endpoints from 'utils/endpoints';
import {StorageGetItem} from 'services/storage';

export const CONFIG_MODULES = {
  APP: 'app',
  MARKETING_HOME: 'home_marketing',
};

export const CONFIG_PROPERTIES = {
  APP: {
    ANDROID_VERSION: 'android_version',
    IOS_VERSION: 'ios_version',
  },
  MARKETING_HOME: {
    DISPLAY_NEWS: 'display_news',
  },
};

const DEFAULT_CONFIG = {
  config_time: '1635933451',
  config_version: 1,
  settings: [
    {
      key: 'app',
      properties: {
        android_version: 1,
        ios_version: 1,
      },
    },
    {
      key: 'home_marketing',
      properties: {
        display_news: false,
      },
    },
  ],
};

var axios = require('axios');

class configStore {
  lastConfigTime: string;
  settings: any;

  constructor() {
    this.lastConfigTime = '';
    this.settings = [];
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'ConfigStore',
      properties: ['lastConfigTime', 'settings'],
      storage: AsyncStorage,
    });
  }

  initializeConfig = action(async () => {
    let isInit = await StorageGetItem('@init', false);
    if (!isInit) {
      this.setConfig(DEFAULT_CONFIG);
      this.checkForUpdatedConfig();
    } else {
      this.checkForUpdatedConfig();
    }
  });

  getModuleProperty(
    module: string,
    property: string,
    defaultValue: any = null,
  ): any {
    let v = defaultValue;
    let m = this.settings.find(o => o.key === module);
    if (m) {
      v = m.properties.hasOwnProperty(property)
        ? m.properties[property]
        : defaultValue;
    }
    return v;
  }

  setConfig = action(config => {
    if (this.lastConfigTime === config.config_time) {
      return;
    }
    this.lastConfigTime = config.config_time;
    this.settings = config.settings;
  });

  checkForUpdatedConfig = action(() => {
    //
    var config = {
      method: 'get',
      responseType: 'json',
      url: endpoints.app,
    };
    return axios(config)
      .then(async response => {
        try {
          this.setConfig(response.data);
        } catch (err) {}
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

export const ConfigStore: configStore = new configStore();
