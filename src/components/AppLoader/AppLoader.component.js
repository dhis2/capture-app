// @flow
import React, { useCallback, useMemo, useEffect } from 'react';
import log from 'loglevel';
import { useHistory } from 'react-router-dom';
import { useDataEngine, useConfig } from '@dhis2/app-runtime';
import { LoadingMaskForPage } from 'capture-core/components/LoadingMasks';
import { DisplayException } from 'capture-core/utils/exceptions';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { environments } from 'capture-core/constants';
import { buildUrl } from 'capture-core-utils';
import { initFeatureAvailability } from 'capture-core-utils/featuresSupport';
import { initializeAsync } from './init';
import { getStore } from '../../store/getStore';

type Props = {
    onRunApp: (store: ReduxStore) => void,
    onCacheExpired: Function,
};

const useApiUtils = () => {
    const dataEngine = useDataEngine();
    const { serverVersion } = useConfig();
    return useMemo(() => ({
        querySingleResource: makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
        mutate: dataEngine.mutate.bind(dataEngine),
        absoluteApiPath: buildUrl(dataEngine.link.config.baseUrl, dataEngine.link.versionedApiPath),
        serverVersion,
    }), [dataEngine, serverVersion]);
};

export const AppLoader = (props: Props) => {
    const { onRunApp, onCacheExpired } = props;
    const [loadError, setLoadError] = React.useState(null);
    const { querySingleResource, mutate, absoluteApiPath, serverVersion } = useApiUtils();
    const history = useHistory();

    const logError = useCallback((error) => {
        if (error instanceof Error) {
            log.error(error.toString());
        } else if (error) {
            log.error(JSON.stringify(error));
        }
    }, []);

    const load = useCallback(async () => {
        try {
            initFeatureAvailability(serverVersion);
            await initializeAsync(
                onCacheExpired,
                querySingleResource,
                serverVersion.minor,
            );
            const store = getStore(
                history, {
                    querySingleResource,
                    mutate,
                    absoluteApiPath,
                    serverVersion,
                },
                // $FlowFixMe[prop-missing] automated comment
                () => onRunApp(store));
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
        querySingleResource,
        mutate,
        absoluteApiPath,
        history,
        serverVersion,
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
