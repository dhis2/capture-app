import React, { useCallback, useMemo, useEffect } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
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
    // We need the ABSOLUTE base url for the instance when building the IndexedDB caches
    // The baseUrl of the root object returned by useConfig is not reliable here as it returns a relative url for:
    // some backend versions (v41 and below) / app-shell versions
    // The latest app-shell will inject the backend's contextPath into the app as baseUrl for backend versions 42 and above,
    // but since we currently need support for older backends we are grabbing the contextPath directly
    const { serverVersion, systemInfo: { contextPath: absoluteBaseUrl } = {} } = useConfig();
    const { fromClientDate } = useTimeZoneConversion();
    return useMemo(() => ({
        querySingleResource: makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
        mutate: dataEngine.mutate.bind(dataEngine),
        // UPDATE 2025.08.28: This is actually getting the RELATIVE api path in a prod enviroment.
        // When we update app-runtime, it will probably get the absolute path for backend versions 42 and above.
        // This is used in the epics for making api requests, so should not matter if absolute or relative,
        // but could be good to refactor at some point.
        // @ts-expect-error - keeping original functionality as before ts rewrite
        absoluteApiPath: buildUrl(dataEngine.link.config.baseUrl, dataEngine.link.versionedApiPath),
        serverVersion,
        absoluteBaseUrl,
        fromClientDate,
    }), [dataEngine, serverVersion, absoluteBaseUrl, fromClientDate]);
};

export const AppLoader = (props: Props) => {
    const { onRunApp, onCacheExpired } = props;
    const [loadError, setLoadError] = React.useState<string | null>(null);
    const {
        querySingleResource,
        mutate,
        absoluteApiPath,
        serverVersion,
        absoluteBaseUrl,
        fromClientDate,
    } = useApiUtils();

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
                baseUrl: absoluteBaseUrl!,
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
            let message = i18n.t('The application could not be loaded.');
            if (error && error instanceof DisplayException) {
                logError((error as any).innerError);
                message += ` ${String((error as any).message || '')}`;
            } else {
                logError(error);
                if (process.env.NODE_ENV !== environments.prod) {
                    message += ` ${i18n.t('Please verify that the server is running.')}`;
                } else {
                    message += ` ${i18n.t('Please see log for details.')}`;
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
        absoluteBaseUrl,
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
