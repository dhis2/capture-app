// @flow
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { type HashHistory } from 'history';
import React, { useState, useRef, useCallback } from 'react';
// eslint-disable-next-line import/extensions
import 'typeface-roboto';
import { theme } from '../../styles/uiTheme';
import { App } from '../App';
import { AppLoader } from '../AppLoader';
import { loadApp } from './appStart.actions';
import { CacheExpired } from './CacheExpired.component';
import { JSSProviderShell } from './JSSProviderShell.component';
import { addBeforeUnloadEventListener } from './unload';

export const AppStart = () => {
    const [ready, setReadyStatus] = useState(false);
    const [cacheExpired, setCacheExpired] = useState(false);

    const store: {current: Object} = useRef();
    const history = useRef();

    const handleRunApp = useCallback((storeArg: ReduxStore, historyArg: HashHistory) => {
        store.current = storeArg;
        history.current = historyArg;
        setReadyStatus(true);
        storeArg.dispatch(loadApp());
        addBeforeUnloadEventListener(storeArg);
    }, [
        setReadyStatus,
        store,
        history,
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
                    {
                        ready ?
                            <App
                                store={store.current}
                                history={history.current}
                            /> :
                            <AppLoader
                                onRunApp={handleRunApp}
                                onCacheExpired={handleCacheExpired}
                            />
                    }
                </MuiThemeProvider>
            </JSSProviderShell>
        </React.Fragment>
    );
};
