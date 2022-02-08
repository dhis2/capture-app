// @flow
import React, { useState, useRef, useCallback } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
// eslint-disable-next-line import/extensions
import 'typeface-roboto';
import { AppLoader } from '../AppLoader';
import { App } from '../App';
import { loadApp } from './appStart.actions';
import { addBeforeUnloadEventListener } from './unload';
import { CacheExpired } from './CacheExpired.component';
import { JSSProviderShell } from './JSSProviderShell.component';
import { theme } from '../../styles/uiTheme';

export const AppStart = () => {
    const [ready, setReadyStatus] = useState(false);
    const [cacheExpired, setCacheExpired] = useState(false);

    const store: {current: Object} = useRef();

    const handleRunApp = useCallback((storeArg: ReduxStore) => {
        store.current = storeArg;
        setReadyStatus(true);
        storeArg.dispatch(loadApp());
        addBeforeUnloadEventListener(storeArg);
    }, [
        setReadyStatus,
        store,
    ]);

    const handleCacheExpired = useCallback(() => {
        setCacheExpired(true);
    }, [setCacheExpired]);

    if (cacheExpired) {
        return (
            <CacheExpired />
        );
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <JSSProviderShell>
                <MuiThemeProvider
                    theme={theme}
                >
                    <Router>
                        {
                            ready ?
                                <App
                                    store={store.current}
                                /> :
                                <AppLoader
                                    onRunApp={handleRunApp}
                                    onCacheExpired={handleCacheExpired}
                                />
                        }
                    </Router>
                </MuiThemeProvider>
            </JSSProviderShell>
        </React.Fragment>
    );
};
