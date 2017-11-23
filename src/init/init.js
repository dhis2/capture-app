// @flow
/* eslint-disable import/prefer-default-export */
import log from 'loglevel';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import environments from 'd2-tracker/constants/environments';

import IndexedDBAdapter from 'd2-tracker/storage/IndexedDBAdapter';

function setLogLevel() {
    const levels = {
        [environments.dev]: log.levels.DEBUG,
        [environments.devDebug]: log.levels.TRACE,
        [environments.test]: log.levels.INFO,
        [environments.prod]: log.levels.ERROR,
    };

    // $FlowSuppress
    let level = levels[process.env.NODE_ENV];
    if (!level && level !== 0) {
        level = log.levels.ERROR;
    }

    log.setLevel(level);
}

async function initializeManifest() {
    const manifest = await getManifest('./manifest.webapp');
    const baseUrl = manifest.getBaseUrl();
    config.baseUrl = `${baseUrl}/api`;
    log.info(`Loading: ${manifest.name} v${manifest.version}`);
}

export async function initializeD2() {
    setLogLevel();

    const d2 = await initializeManifest()
        .then(getUserSettings)
        .then(init);
    
    const idbAdapter = new IndexedDBAdapter({ name: 'test', version: 2, keyPath: 'id', objectStore: ['testStore'] });
    try {
        await idbAdapter.open();

        //idbAdapter.set('testStore', { id: '534tgge', testContents: 'ccc' });
                
        await idbAdapter.setAll('testStore', [{ id: '534tgge', testContents: '654w646' }]);
        const x = await idbAdapter.getKeys('testStore');
        await idbAdapter.destroy();
        
        
    } catch (error) {
        console.log(error);
    }
    
    return d2;
}
