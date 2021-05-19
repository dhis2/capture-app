// @flow
/* eslint-disable no-underscore-dangle */
import type { SystemSettings } from '../../metaData';

class SystemSettingsStore {
    _systemSettings: SystemSettings;

    set(settings: SystemSettings) {
        this._systemSettings = settings;
    }

    get() {
        return this._systemSettings;
    }
}

export const systemSettingsStore = new SystemSettingsStore();
