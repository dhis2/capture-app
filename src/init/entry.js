// @flow
/* eslint-disable import/extensions */
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import 'typeface-roboto';
import createHistory from 'history/createHashHistory';

import D2UIApp from '@dhis2/d2-ui-app';
import { LoadingMask } from '@dhis2/d2-ui-core';

import environments from 'capture-core/constants/environments';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

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

async function loadApp(domElement: HTMLElement) {
    render(
        <D2UIApp>
            <LoadingMask />
        </D2UIApp>,
        domElement,
    );

    try {
        await initialize();
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
