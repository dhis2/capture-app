// @flow
/* eslint-disable import/first */
import './app.css';
import D2UIApp from '@dhis2/d2-ui-app';
import { ConnectedRouter } from 'connected-react-router';
import type { HashHistory } from 'history';
import * as React from 'react';
import { Provider } from 'react-redux';
import { AppContents } from './AppContents.component';

type Props = {
    store: ReduxStore,
    history: ?HashHistory,
};

export const App = ({ store, history }: Props) => (
    <React.Fragment>
        <Provider
            store={store}
        >
            <ConnectedRouter
                history={history}
            >
                <D2UIApp>
                    <AppContents />
                </D2UIApp>
            </ConnectedRouter>
        </Provider>
    </React.Fragment>
);
