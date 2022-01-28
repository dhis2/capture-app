// @flow
/* eslint-disable import/first */
import './app.css';
import * as React from 'react';
import { Provider } from 'react-redux';
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
            <D2UIApp>
                <AppContents />
            </D2UIApp>
        </Provider>
    </React.Fragment>
);
