// @flow
/* eslint-disable import/first */
import './app.css';
import * as React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import D2UIApp from '@dhis2/d2-ui-app';
import { AppContents } from './AppContents.component';

type Props = {
    store: ReduxStore,
};

export const App = ({ store }: Props) => (
    <React.Fragment>
        <Provider
            store={store}
        >
            <Router>
                <D2UIApp>
                    <AppContents />
                </D2UIApp>
            </Router>
        </Provider>
    </React.Fragment>
);
