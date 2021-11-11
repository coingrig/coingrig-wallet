import {Migration as M01} from './migrations/01_1.0.1';
import {StorageGetItem, StorageSetItem} from './storage';
import CONFIG from '../config';
import {Logs} from './logs';

const MIGRATION_KEY = '@MIGRATION_KEY';

const MIGRATIONS_SET = [
    M01
]

class MigrationService {
    currentMigrationVersion: any;
    installedMigration: any;

    constructor() {

    }

    migrationRequired = async () => {        
        // this.installedMigration = await StorageGetItem(MIGRATION_KEY, false);
        // this.currentMigrationVersion = CONFIG.BUILD_NUMBER ?? 0;
        // // If current build number is larger than last stored build number
        // // we will check if a migration is required
        // if (this.installedMigration >= this.currentMigrationVersion) {
        //     return false;
        // }
        for (let i = 0; i < MIGRATIONS_SET.length; i++) {
            const migration = new MIGRATIONS_SET[i]();
            if(await migration.migrationRequired()) {
                return true;
            }
        }
        return false;
    }

    handleMigrations = async () => {
        for (let i = 0; i < MIGRATIONS_SET.length; i++) {
            const migration = new MIGRATIONS_SET[i]();
            if(await migration.migrationRequired()) {
                await migration.migrationHandler();
            }
        }
        // Once all migrations have completed, we save our build number
        // so that we no longer need to run migrations checks again
        // StorageSetItem(MIGRATION_KEY, '0', false)
    }

}

let service = new MigrationService();
export {service as MigrationService};
