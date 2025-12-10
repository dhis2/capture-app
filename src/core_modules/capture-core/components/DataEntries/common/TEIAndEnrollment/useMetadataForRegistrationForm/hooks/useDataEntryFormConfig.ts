import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useEffect } from 'react';
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

type Props = {
    selectedScopeId: string;
};

const configQuery = {
    resource: 'dataStore/capture/dataEntryForms',
};

export const useDataEntryFormConfig = ({ selectedScopeId }: Props) => {
    const {
        data: configExists,
        isError: namespaceIsError,
        isFetched: namespaceIsFetched,
        error: namespaceError,
    } = useApiMetadataQuery<any>(
        ['dataStore', 'capture'],
        { resource: 'dataStore/capture' },
        { select: (captureKeys: Array<string> | null) => captureKeys?.includes('dataEntryForms') },
    );

    const {
        data: dataEntryFormConfig,
        isFetched,
        isError,
        error,
    } = useApiMetadataQuery(['dataEntryFormConfig', selectedScopeId], configQuery, {
        enabled: !!configExists && !!selectedScopeId,
        select: (dataEntryFormConfigQuery: any) => dataEntryFormConfigQuery?.[selectedScopeId] ?? null,
    });

    useEffect(() => {
        if (namespaceIsError) {
            log.error(errorCreator('capture namespace could not be fetched from the datastore')({ namespaceError }));
        }
        if (isError) {
            log.error(errorCreator('dataEntryForms namespace could not be fetched from the datastore')({ error }));
        }
    }, [isError, error, namespaceIsError, namespaceError]);

    const configIsFetched = (namespaceIsFetched && !configExists) || isFetched;

    return namespaceIsError || isError
        ? {
            dataEntryFormConfig: null,
            configIsFetched: true,
            isLoading: false,
        }
        : { dataEntryFormConfig,
            configIsFetched,
            isLoading: !configIsFetched,
        };
};
