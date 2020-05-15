// @flow
/* eslint-disable import/extensions */
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import 'typeface-roboto';
import i18n from '@dhis2/d2-i18n';
import { DataProvider } from '@dhis2/app-runtime';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

import type { HashHistory } from 'history/createHashHistory';

import './addRxjsOperators';
import AppLoader from './AppLoader.component';
import App from '../components/App/App.component';

import { loadApp } from './entry.actions';
import { addBeforeUnloadEventListener } from '../unload';

// Change the insertion point for jss styles.
// For this app the insertion point should be below the css.
const insertionPoint = document.createElement('noscript');
insertionPoint.setAttribute('id', 'jss-insertion-point');
document.head.appendChild(insertionPoint);
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = insertionPoint;

// DOM element to use as the container for the App
const DOM_ID = 'app';
const domElement = document.getElementById(DOM_ID);
if (!domElement) {
    const domElementError = `html element with id ${DOM_ID} is missing in index file`;
    log.error(domElementError);
    throw domElementError;
}

function JSSProviderShell(props) {
    return (
        <JssProvider jss={jss} generateClassName={generateClassName}>
            {props.children}
        </JssProvider>
    );
}

function handleCacheExpired() {
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

function runApp(store: ReduxStore, history: HashHistory) {
    store.dispatch(loadApp());
    addBeforeUnloadEventListener(store);
    render(
        <JSSProviderShell>
            <DataProvider
                baseUrl={process.env.REACT_APP_DHIS2_BASE_URL}
                apiVersion=""
            >
                <App
                    store={store}
                    history={history}
                />
            </DataProvider>
        </JSSProviderShell>,
        domElement,
    );
}

async function loadAppAsync() {
    render(
        <JSSProviderShell>
            <DataProvider
                baseUrl={process.env.REACT_APP_DHIS2_BASE_URL}
                apiVersion=""
            >
                <AppLoader
                    onRunApp={runApp}
                    onCacheExpired={handleCacheExpired}
                />
            </DataProvider>
        </JSSProviderShell>,
        domElement,
    );
}

loadAppAsync();
