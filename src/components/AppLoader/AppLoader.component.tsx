import React, { useCallback, useMemo, useEffect, useState } from 'react';
import log from 'loglevel';
import { useDataEngine, useConfig, useTimeZoneConversion } from '@dhis2/app-runtime';
import { LoadingMaskForPage } from 'capture-core/components/LoadingMasks';
import { DisplayException } from 'capture-core/utils/exceptions';
import { useNavigate } from 'capture-core/utils/routing';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { environments } from 'capture-core/constants';
import { buildUrl } from 'capture-core-utils';
import { initFeatureAvailability } from 'capture-core-utils/featuresSupport';
import { initializeAsync } from './init';
import { getStore } from '../../store/getStore';
import { ReduxStore } from '../../types/global.types';

interface Props {
    onRunApp: (store: ReduxStore) => void;
    onCacheExpired: () => void;
}

const useApiUtils = () => {
    const dataEngine = useDataEngine();
    const { serverVersion } = useConfig();
    const { fromClientDate } = useTimeZoneConversion();
    return useMemo(() => ({
        querySingleResource: makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
        mutate: dataEngine.mutate.bind(dataEngine),
        absoluteApiPath: buildUrl('', ''), // Simplified to avoid private property access
        serverVersion,
        fromClientDate,
    }), [dataEngine, serverVersion, fromClientDate]);
};

export const AppLoader: React.FC<Props> = (props) => {
    const { onRunApp, onCacheExpired } = props;
    const [loadError, setLoadError] = useState<string | null>(null);
    const { querySingleResource, mutate, absoluteApiPath, serverVersion, fromClientDate } = useApiUtils();

    const { navigate } = useNavigate();

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
                serverVersion?.minor || 0,
            );
            const store = getStore(
                navigate, {
                    querySingleResource,
                    mutate,
                    absoluteApiPath,
                    serverVersion,
                    fromClientDate,
                },
                () => onRunApp(store as unknown as ReduxStore));
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
        navigate,
        serverVersion,
        fromClientDate,
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
