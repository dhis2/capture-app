// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useEffect } from 'react';
import { useApiMetadataQuery } from '../../../utils/reactQueryHelpers';
import { useUserLocale } from '../../../utils/localeData/useUserLocale';
import type { DataStoreConfiguration } from '../WidgetBulkDataEntry.types';
import { bulkDataEntryDatastoreSchema } from '../../../../../types';

const validateStructure = (data) => {
    const supportedVersion = 1;
    const { success, error } = bulkDataEntryDatastoreSchema.safeParse(data);

    if (success && data.version !== supportedVersion) {
        return {
            data: null,
            validationError: 'Only version 1 of the bulkDataEntry is supported in this version of the app',
        };
    }

    return {
        data: success ? data : null,
        validationError: !success
            ? error.message || 'An unknown error occurred loading the bulkDataEntry Schema'
            : null,
    };
};

const getLocalizedString = (field: { [string]: string }, locale: string): string => {
    if (field[locale]) {
        return field[locale];
    }

    return field[Object.keys(field)[0]];
};

export const useBulkDataEntryConfigurations = (
    programId: string,
): {|
    bulkDataEntryConfigurations?: Array<DataStoreConfiguration>,
    isLoading: boolean,
    isError: boolean,
|} => {
    const { locale } = useUserLocale();
    const {
        data: configExists,
        isLoading: namespaceIsLoading,
        isError: namespaceIsError,
        error: namespaceError,
    } = useApiMetadataQuery<any>(
        ['dataStore', 'capture'],
        { resource: 'dataStore/capture' },
        { select: (captureKeys: ?Array<string>) => captureKeys?.includes('bulkDataEntry') },
    );

    const { data, isLoading, isError, error } = useApiMetadataQuery<any>(
        ['bulkDataEntryConfigurations'],
        { resource: 'dataStore/capture/bulkDataEntry' },
        {
            enabled: !!configExists && !!programId,
            select: (dataStoreConfigurationRaw) => {
                const { data: dataStoreConfigurationValidated, validationError } =
                    validateStructure(dataStoreConfigurationRaw);

                if (validationError) {
                    log.error(validationError);
                    return [];
                }

                return dataStoreConfigurationValidated?.config.reduce((acc, configuration) => {
                    if (configuration.programId === programId) {
                        const configurationWithLocale: DataStoreConfiguration = {
                            ...configuration,
                            title: getLocalizedString(configuration.title, locale),
                            subtitle: configuration.subtitle
                                ? getLocalizedString(configuration.subtitle, locale)
                                : undefined,
                        };
                        acc = [...acc, configurationWithLocale];
                    }
                    return acc;
                }, []);
            },
        },
    );

    useEffect(() => {
        if (namespaceIsError) {
            log.error(errorCreator('capture namespace could not be fetched from the datastore')({ namespaceError }));
        }
        if (isError) {
            log.error(errorCreator('bulkDataEntry key could not be fetched from the datastore')({ error }));
        }
    }, [isError, error, namespaceIsError, namespaceError]);

    return {
        bulkDataEntryConfigurations: data,
        isLoading: namespaceIsLoading || isLoading,
        isError,
    };
};
