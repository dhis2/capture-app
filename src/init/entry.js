// @flow
/* eslint-disable import/extensions */
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import 'typeface-roboto';
import { createHashHistory as createHistory } from 'history';

// import D2UIApp from '@dhis2/d2-ui-app';
import LoadingMask from 'capture-core/components/LoadingMasks/LoadingMaskForPage.component';

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

// Change the insertion point for jss styles.
// For this app the insertion point should be below the css.
const insertionPoint = document.createElement('noscript');
insertionPoint.setAttribute('id', 'jss-insertion-point');
document.head.appendChild(insertionPoint);
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = insertionPoint;

function JSSProviderShell(props) {
    return (
        <JssProvider jss={jss} generateClassName={generateClassName}>
            {props.children}
        </JssProvider>
    );
}

function runApp(domElement: HTMLElement, store: ReduxStore, history: HashHistory) {
    store.dispatch(loadApp());
    addBeforeUnloadEventListener(store);
    render(
        <JSSProviderShell>
            <App
                store={store}
                history={history}
            />
        </JSSProviderShell>,
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

function logError(error) {
    if (error instanceof Error) {
        log.error(error.toString());
    } else if (error) {
        log.error(JSON.stringify(error));
    }
}

async function loadAppAsync(domElement: HTMLElement) {
    render(
        <JSSProviderShell>
            <LoadingMask />
        </JSSProviderShell>,
        domElement,
    );

    try {
        await initializeAsync(() => handleCacheExpired(domElement));
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
