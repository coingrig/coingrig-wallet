import {action, makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

class settingsStore {
  confirmationEnabled: boolean;
  mnemonicBackupDone: boolean;

  constructor() {
    this.confirmationEnabled = true;
    this.mnemonicBackupDone = false;
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'SettingsStore',
      properties: ['confirmationEnabled', 'mnemonicBackupDone'],
      storage: AsyncStorage,
    });
  }

  setMnemonicBackupDone = action((value: boolean) => {
    this.mnemonicBackupDone = value;
  });

  setConfirmation = action((value: boolean) => {
    this.confirmationEnabled = value;
  });
}

export const SettingsStore: settingsStore = new settingsStore();
