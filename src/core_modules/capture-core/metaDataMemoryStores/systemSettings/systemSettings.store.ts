/* eslint-disable no-underscore-dangle */
import { SystemSettings } from '../../metaData';

class SystemSettingsStore {
    private _systemSettings: SystemSettings;

    set(settings: SystemSettings): void {
        this._systemSettings = settings;
    }

    get(): SystemSettings {
        return this._systemSettings;
    }
}

export const systemSettingsStore = new SystemSettingsStore(); 