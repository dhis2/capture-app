// @flow
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import 'typeface-roboto';

import environments from 'capture-core/constants/environments';

import { setD2 } from 'capture-core/d2/d2Instance';

import './react16Temp';
import App from '../components/App/App.component';
import store from '../store';
import { initializeD2, initializeMetaData, initializeSessionAppCache, getBaseSettings } from './init';
import { startupDataLoad } from './entry.actions';

//TEST
import { startEnrollmentLoad } from 'capture-core/actions/__TEMP__/enrollment.actions';
//END TEST

const DOM_ID = 'app';

async function runApp() {
    render(
        <App
            store={store}
        />,
        document.getElementById(DOM_ID),
    );

    try {
        const d2 = await initializeD2();
        setD2(d2);
        const baseSettings = await getBaseSettings();
        await initializeMetaData(baseSettings.systemSettings);
        await initializeSessionAppCache();
        store.dispatch(startupDataLoad());

        //START TEST
        store.dispatch(startEnrollmentLoad());
        //END TEST

    } catch (error) {
        log.error(error);
        let message = 'The application could not be loaded.';
        if (process.env.NODE_ENV !== environments.prod) {
            message += ' Please verify that the server is running.';
        }

        render(<div>{message}</div>, document.getElementById(DOM_ID));
    }
}

runApp();

