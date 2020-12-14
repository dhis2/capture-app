// @flow
import React, { useCallback, useMemo, useEffect } from 'react';
import log from 'loglevel';
import { createHashHistory as createHistory, type HashHistory } from 'history';
import { useDataEngine } from '@dhis2/app-runtime';
import { LoadingMaskForPage } from 'capture-core/components/LoadingMasks';
import { DisplayException } from 'capture-core/utils/exceptions';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { environments } from 'capture-core/constants';
import { buildUrl } from 'capture-core-utils';
import { initializeAsync } from './init';
import { getStore } from '../../store/getStore';

type Props = {
    onRunApp: (store: ReduxStore, history: HashHistory) => void,
    onCacheExpired: Function,
};

const useApiUtils = () => {
    const dataEngine = useDataEngine();
    return useMemo(() => ({
        query: makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
        mutate: dataEngine.mutate.bind(dataEngine),
        absoluteApiPath: buildUrl(dataEngine.link.baseUrl, dataEngine.link.apiPath),
    }), [dataEngine]);
};

const AppLoader = (props: Props) => {
    const { onRunApp, onCacheExpired } = props;
    const [loadError, setLoadError] = React.useState(null);
    const apiUtils = useApiUtils();

    const logError = useCallback((error) => {
        if (error instanceof Error) {
            log.error(error.toString());
        } else if (error) {
            log.error(JSON.stringify(error));
        }
    }, []);

    const load = useCallback(async () => {
        try {
            await initializeAsync(
                onCacheExpired,
                apiUtils.query,
                apiUtils.absoluteApiPath,
            );
            const history = createHistory();
            const store = getStore(
                history,
                apiUtils,
                // $FlowFixMe[prop-missing] automated comment
                () => onRunApp(store, history));
        } catch (error) {
            let message = 'The application could not be loaded.';
            if (error && error instanceof DisplayException) {
                logError(error.innerError);
                message += ` ${error.toString()}`;
            } else {
                logError(error);
                if (process.env.NODE_ENV !== environments.prod) {
                    message += ' Please verify that the server is running.';
                } else {
                    message += ' Please see log for details.';
                }
            }
            setLoadError(message);
        }
    }, [
        logError,
        onCacheExpired,
        onRunApp,
        apiUtils,
    ]);

    useEffect(() => {
        load();
    }, [
        load,
    ]);

    return loadError || (
        <LoadingMaskForPage />
    );
};

export default AppLoader;
