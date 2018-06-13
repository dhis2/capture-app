// @flow
/* eslint-disable import/extensions */
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import 'typeface-roboto';
import createHistory from 'history/createHashHistory';
import type { HashHistory } from 'history/createHashHistory';

import D2UIApp from '@dhis2/d2-ui-app';
import { LoadingMask } from '@dhis2/d2-ui-core';

import environments from 'capture-core/constants/environments';

// TEST
// import { startEnrollmentLoad } from 'capture-core/actions/__TEMP__/enrollment.actions';
// END TEST

import App from '../components/App/App.component';
import getStore from '../getStore';
import { initialize } from './init';
import { startupDataLoad } from './entry.actions';

const DOM_ID = 'app';

async function runApp(domElement: HTMLElement) {
    render(
        <D2UIApp>
            <LoadingMask />
        </D2UIApp>,
        domElement
    );

    try {
        await initialize();

        const history = createHistory();
        const store = getStore(history);

        store.dispatch(startupDataLoad());

        // START TEST
        // store.dispatch(startEnrollmentLoad());
        // END TEST
        render(
            <App
                store={store}
                history={history}
            />,
            domElement,
        );
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
