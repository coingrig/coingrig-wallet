import axios from 'axios';
import {action, makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import endpoints from 'utils/endpoints';
import {StorageGetItem} from 'services/storage';
import CONFIG from 'config';
import {Platform} from 'react-native';
import {Logs} from 'services/logs';

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
    {
      key: 'referral',
      properties: {
        enabled: false,
      },
    },
  ],
};

class configStore {
  lastConfigTime: string;
  settings: any;
  feeAddress: string;
  isDonation: boolean;
  feeAmount: number;

  constructor() {
    this.lastConfigTime = '';
    this.settings = [];
    this.feeAddress = CONFIG.FEE_RECIPIENT;
    this.isDonation = true;
    this.feeAmount = 0;
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'ConfigStore',
      properties: [
        'lastConfigTime',
        'settings',
        'feeAddress',
        'isDonation',
        'feeAmount',
      ],
      storage: AsyncStorage,
    });
  }

  // Getters
  get requiresUpdate() {
    let current = 0;
    let req = 0;
    if (Platform.OS === 'android') {
      current = CONFIG.BUILD_NUMBER_ANDROID;
      req = this.getModuleProperty('app', 'android_version', current);
    }
    if (Platform.OS === 'ios') {
      current = CONFIG.BUILD_NUMBER_IOS;
      req = this.getModuleProperty('app', 'ios_version', current);
    }
    return current < req;
  }
  //

  setFeeAddress = action(address => {
    this.feeAddress = address;
    this.isDonation = false;
  });

  resetFeeAddress = action(() => {
    this.feeAddress = CONFIG.FEE_RECIPIENT;
    this.isDonation = true;
  });

  updateFee = action(amount => {
    if (!this.isDonation) {
      if (this.feeAmount > CONFIG.MAX_REF_FEE) {
        this.resetFeeAddress();
      } else {
        this.feeAmount = Number(this.feeAmount) + Number(amount);
        Logs.info('Referral Fees:', this.feeAmount);
      }
    }
  });

  initializeConfig = action(async () => {
    const isInit = await StorageGetItem(CONFIG.INIT_KEY, false);
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
    const m = this.settings.find(o => o.key === module);
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
    var config: any = {
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
