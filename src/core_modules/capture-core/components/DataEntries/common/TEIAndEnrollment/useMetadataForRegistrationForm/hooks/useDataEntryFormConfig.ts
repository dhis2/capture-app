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
        isLoading: namespaceIsLoading,
    } = useApiMetadataQuery<any>(
        ['dataStore', 'capture'],
        { resource: 'dataStore/capture' },
        { select: (captureKeys: Array<string> | null) => captureKeys?.includes('dataEntryForms') },
    );

    const {
        data: dataEntryFormConfig,
        isFetched: configIsFetched,
        isInitialLoading,
    } = useApiMetadataQuery(['dataEntryFormConfig', selectedScopeId], configQuery, {
        enabled: !!configExists && !!selectedScopeId,
        select: (dataEntryFormConfigQuery: any) => dataEntryFormConfigQuery?.[selectedScopeId] ?? null,
    });

    if (!namespaceIsLoading && configExists === false) {
        return {
            dataEntryFormConfig: null,
            configIsFetched: true,
        };
    }

    return {
        dataEntryFormConfig,
        configIsFetched,
        isLoading: isInitialLoading,
    };
};
