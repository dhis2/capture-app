// @flow
/* eslint-disable import/extensions */
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import 'typeface-roboto';

import environments from 'capture-core/constants/environments';

// TEST
import { startEnrollmentLoad } from 'capture-core/actions/__TEMP__/enrollment.actions';
// END TEST

import App from '../components/App/App.component';
import store from '../store';
import { initialize } from './init';
import { startupDataLoad } from './entry.actions';

const DOM_ID = 'app';

async function runApp(domElement: HTMLElement) {
    render(
        <App
            store={store}
        />,
        domElement,
    );

    try {
        await initialize();
        store.dispatch(startupDataLoad());

        // START TEST
        store.dispatch(startEnrollmentLoad());
        // END TEST
    } catch (error) {
        log.error(error);
        let message = 'The application could not be loaded.';
        if (process.env.NODE_ENV !== environments.prod) {
            message += ' Please verify that the server is running.';
        }

        render(
            <div>{message}</div>,
            domElement,
        );
    }
}

const domElement = document.getElementById(DOM_ID);
if (!domElement) {
    log.error(`html element with id ${DOM_ID} is missing in index file`);
} else {
    runApp(domElement);
}
