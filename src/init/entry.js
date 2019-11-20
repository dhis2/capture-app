// @flow
/* eslint-disable import/extensions */
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import 'typeface-roboto';
import createHistory from 'history/createHashHistory';

import D2UIApp from '@dhis2/d2-ui-app';
import { LoadingMask } from '@dhis2/d2-ui-core';

import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

import environments from 'capture-core/constants/environments';
import cleanUp from 'capture-core/cleanUp/cleanUp';

import type { HashHistory } from 'history/createHashHistory';

import './addRxjsOperators';
import App from '../components/App/App.component';
import getStore from '../getStore';
import { initialize } from './init';
import { startupDataLoad } from './entry.actions';

const DOM_ID = 'app';

// change the insertion point for jss styles so they don't collide
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

function runApp(domElement: HTMLElement, store: ReduxStore, history: HashHistory) {
    store.dispatch(startupDataLoad());

    window.addEventListener('beforeunload', (e) => {
        cleanUp(store);

        if (store.getState().offline.outbox.length > 0) {
            const msg = 'Unsaved events!';
            e.returnValue = msg;
            return msg;
        }
        return undefined;
    });

    render(
        <JssProvider jss={jss} generateClassName={generateClassName}>
            <App
                store={store}
                history={history}
            />
        </JssProvider>,
        domElement,
    );
}

function handleCacheExpired(domElement: HTMLElement) {
    render(
        <div>
            {
                // keeping this on one line due to issues with i18n
                i18n.t(
                    'You opened another version of the Capture App in the same domain. Currently, the Capture App only supports running one version concurrently (in the same domain). Please refresh this page if you would like to use this version again, but be aware that this will close other versions.',
                )
            }
        </div>,
        domElement,
    );
}

async function loadApp(domElement: HTMLElement) {
    render(
        <D2UIApp>
            <LoadingMask />
        </D2UIApp>,
        domElement,
    );

    try {
        await initialize(() => handleCacheExpired(domElement));
        const history = createHistory();
        const store = getStore(history, () => runApp(domElement, store, history));
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
    loadApp(domElement);
}
