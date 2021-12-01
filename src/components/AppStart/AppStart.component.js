// @flow
import React, { useState, useRef, useCallback } from 'react';
import { type HashHistory } from 'history';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// eslint-disable-next-line import/extensions
import 'typeface-roboto';
import { AppLoader } from '../AppLoader';
import { App } from '../App';
import { theme } from '../../styles/uiTheme';
import { addBeforeUnloadEventListener } from './unload';
import { JSSProviderShell } from './JSSProviderShell.component';
import { CacheExpired } from './CacheExpired.component';
import { loadApp } from './appStart.actions';

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
