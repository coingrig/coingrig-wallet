import {action, makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

class settingsStore {
  confirmationEnabled: boolean;

  constructor() {
    this.confirmationEnabled = true;
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'SettingsStore',
      properties: ['confirmationEnabled'],
      storage: AsyncStorage,
    });
  }

  setConfirmation = action((value: boolean) => {
    this.confirmationEnabled = value;
  });
}

export const SettingsStore: settingsStore = new settingsStore();
