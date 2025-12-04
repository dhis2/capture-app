import React, { useState, useRef, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter as Router } from 'react-router-dom';
// eslint-disable-next-line import/extensions
import 'typeface-roboto';
import { AppLoader } from '../AppLoader';
import { App } from '../App';
import { loadApp } from './appStart.actions';
import { addBeforeUnloadEventListener } from './unload';
import { CacheExpired } from './CacheExpired.component';

// Define a basic type for the Redux store
interface ReduxStore {
    dispatch: (action: any) => void;
    getState: () => any;
}

export const AppStart = () => {
    const queryClient = new QueryClient();
    const [readyStatus, setReadyStatus] = useState<boolean>(false);
    const [cacheExpired, setCacheExpired] = useState<boolean>(false);

    const store = useRef<ReduxStore | null>(null);

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
        <Router>
            {
                readyStatus ?
                    <App
                        store={store.current as ReduxStore}
                    /> :
                    <AppLoader
                        onRunApp={handleRunApp}
                        onCacheExpired={handleCacheExpired}
                    />
            }
        </Router>
    );
};
