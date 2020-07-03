// @flow
import React, { useState, useRef, useCallback } from 'react';
// eslint-disable-next-line import/extensions
import 'typeface-roboto';
import type { HashHistory } from 'history/createHashHistory';
import './addRxjsOperators';
import { AppLoader } from '../AppLoader';
import { App } from '../App';
import { loadApp } from './appStart.actions';
import { addBeforeUnloadEventListener } from './unload';
import { CacheExpired } from './CacheExpired.component';
import { JSSProviderShell } from './JSSProviderShell.component';

export const AppStart = () => {
    const [ready, setReadyStatus] = useState(false);
    const [cacheExpired, setCacheExpired] = useState(false);

    const store = useRef();
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
        <JSSProviderShell>
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
        </JSSProviderShell>
    );
};
