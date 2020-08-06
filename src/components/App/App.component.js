// @flow
/* eslint-disable import/first */
import './app.css';
import * as React from 'react';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ConnectedRouter } from 'connected-react-router';
import D2UIApp from '@dhis2/d2-ui-app';
import type { HashHistory } from 'history/createHashHistory';
import theme from '../../styles/uiTheme';
import { AppContents } from './AppContents.component';

type Props = {
    store: ReduxStore,
    history: HashHistory,
};

export const App = ({ store, history }: Props) => (
    <React.Fragment>
        <CssBaseline />
        <Provider
            store={store}
        >
            <ConnectedRouter
                history={history}
            >
                <MuiThemeProvider
                    theme={theme}
                >
                    <D2UIApp>
                        <AppContents />
                    </D2UIApp>
                </MuiThemeProvider>
            </ConnectedRouter>
        </Provider>
    </React.Fragment>
);
