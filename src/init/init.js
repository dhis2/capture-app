// @flow
/* eslint-disable import/prefer-default-export */
import log from 'loglevel';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import environments from 'd2-tracker/constants/environments';

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

async function initializeManifest(dhisDevConfig: DhisDevConfig) {
    const manifest = await getManifest('./manifest.webapp');
    const baseUrl = process.env.NODE_ENV === environments.prod ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
    // USING THIS -> REALLY SHOULD WORK, NEED TO LOOK AT THIS const baseUrl = manifest.getBaseUrl();
    config.baseUrl = `${baseUrl}/api`;
    log.info(`Loading: ${manifest.name} v${manifest.version}`);
}

export async function initializeD2() {
    setLogLevel();
    // $FlowSuppress     
    const dhisDevConfig: DhisDevConfig = DHIS_CONFIG; // eslint-disable-line 
    const d2 = await initializeManifest(dhisDevConfig)
        .then(getUserSettings)
        .then(init);

    return d2;
}
