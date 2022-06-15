import {WalletStore} from 'stores/wallet';
import {Migration as M01} from './migrations/01_1.1.0';
import {Migration as M02} from './migrations/02_1.2.0';
import {StorageGetItem, StorageSetItem} from './storage';
import CONFIG from '../config';
import {Platform} from 'react-native';

const MIGRATION_KEY = CONFIG.MIGRATION_KEY;

const MIGRATIONS_SET = [M01, M02];

class MigrationService {
  currentMigrationVersion: any;
  installedMigration: any;

  constructor() {}

  migrationRequired = async () => {
    const isInit = await StorageGetItem('@init', false);
    if (!isInit) {
      return false;
    }
    const buildNumber =
      Platform.OS === 'android'
        ? CONFIG.BUILD_NUMBER_ANDROID
        : CONFIG.BUILD_NUMBER_IOS;
    this.installedMigration = await StorageGetItem(MIGRATION_KEY, false);
    this.installedMigration = parseInt(this.installedMigration, 10);
    this.currentMigrationVersion = buildNumber ?? 0;
    // If current build number is larger than last stored build number
    // we will check if a migration is required
    if (this.installedMigration >= this.currentMigrationVersion) {
      return false;
    }
    await WalletStore.hydrateStore();
    for (let i = 0; i < MIGRATIONS_SET.length; i++) {
      const migration = new MIGRATIONS_SET[i]();
      if (await migration.migrationRequired(this.installedMigration)) {
        return true;
      }
    }
    return false;
  };

  handleMigrations = async () => {
    for (let i = 0; i < MIGRATIONS_SET.length; i++) {
      const migration = new MIGRATIONS_SET[i]();
      if (await migration.migrationRequired(this.installedMigration)) {
        await migration.migrationHandler();
      }
    }
    // Once all migrations have completed, we save our build number
    // so that we no longer need to run migrations checks again
    const buildNumber =
      Platform.OS === 'android'
        ? CONFIG.BUILD_NUMBER_ANDROID
        : CONFIG.BUILD_NUMBER_IOS;
    StorageSetItem(MIGRATION_KEY, buildNumber.toString(), false);
  };
}

const service = new MigrationService();
export {service as MigrationService};
