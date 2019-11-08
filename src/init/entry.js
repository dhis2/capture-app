// @flow
/* eslint-disable import/extensions */
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import 'typeface-roboto';
import createHistory from 'history/createHashHistory';

import D2UIApp from '@dhis2/d2-ui-app';
import { LoadingMask } from '@dhis2/d2-ui-core';

import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

import environments from 'capture-core/constants/environments';
import { DisplayException } from 'capture-core/utils/exceptions/DisplayException';

import type { HashHistory } from 'history/createHashHistory';

import './addRxjsOperators';
import App from '../components/App/App.component';
import getStore from '../store/getStore';
import { initializeAsync } from './init';
import { loadApp } from './entry.actions';
import { addBeforeUnloadEventListener } from '../unload';

const DOM_ID = 'app';

// change the insertion point for jss styles so they don't collide
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

function runApp(domElement: HTMLElement, store: ReduxStore, history: HashHistory) {
    store.dispatch(loadApp());
    addBeforeUnloadEventListener(store);
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

function logError(error) {
    if (error instanceof Error) {
        log.error(error.toString());
    } else if (error) {
        log.error(JSON.stringify(error));
    }
}

async function loadAppAsync(domElement: HTMLElement) {
    render(
        <D2UIApp>
            <LoadingMask />
        </D2UIApp>,
        domElement,
    );

    try {
        await initializeAsync();
        const history = createHistory();
        const store = getStore(history, () => runApp(domElement, store, history));
    } catch (error) {
        let message = 'The application could not be loaded.';
        if (error && error instanceof DisplayException) {
            logError(error.innerError);
            message += ` ${error.toString()}`;
        } else {
            logError(error);
            if (process.env.NODE_ENV !== environments.prod) {
                message += ' Please verify that the server is running.';
            } else {
                message += ' Please see log for details.';
            }
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
    loadAppAsync(domElement);
}
