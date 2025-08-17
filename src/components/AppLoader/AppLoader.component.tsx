import React, { useCallback, useMemo, useEffect } from 'react';
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

type PlainReduxStore = {
    dispatch: (action: any) => void;
    getState: () => any;
};

type Props = {
    onRunApp: (store: PlainReduxStore) => void;
    onCacheExpired: () => void;
};

const useApiUtils = () => {
    const dataEngine = useDataEngine();
    const { serverVersion, baseUrl } = useConfig();
    const { fromClientDate } = useTimeZoneConversion();
    return useMemo(() => ({
        querySingleResource: makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
        mutate: dataEngine.mutate.bind(dataEngine),
        absoluteApiPath: buildUrl((dataEngine as any).link.config.baseUrl, (dataEngine as any).link.versionedApiPath),
        serverVersion,
        baseUrl,
        fromClientDate,
    }), [dataEngine, serverVersion, baseUrl, fromClientDate]);
};

export const AppLoader = (props: Props) => {
    const { onRunApp, onCacheExpired } = props;
    const [loadError, setLoadError] = React.useState<string | null>(null);
    const { querySingleResource, mutate, absoluteApiPath, serverVersion, baseUrl, fromClientDate } = useApiUtils();

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
            await initializeAsync({
                onCacheExpired,
                querySingleResource,
                serverVersion: serverVersion as any,
                baseUrl,
            });
            const store = await getStore(
                navigate, {
                    querySingleResource,
                    mutate,
                    absoluteApiPath,
                    serverVersion,
                    fromClientDate,
                },
                () => onRunApp(store));
        } catch (error) {
            let message = 'The application could not be loaded.';
            if (error && error instanceof DisplayException) {
                logError((error as any).innerError);
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
        baseUrl,
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
