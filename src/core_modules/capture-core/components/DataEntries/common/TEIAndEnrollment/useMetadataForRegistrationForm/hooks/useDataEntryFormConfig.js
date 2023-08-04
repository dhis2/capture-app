// @flow

import { useDataEngine } from '@dhis2/app-runtime';
import { useQuery } from 'react-query';

type Props = {|
    selectedScopeId: string,
|}

const configQuery = {
    dataEntryFormConfigQuery: {
        resource: 'dataStore/capture/dataEntryForms',
    },
};

export const useDataEntryFormConfig = ({ selectedScopeId }: Props) => {
    const dataEngine = useDataEngine();


    const { data: dataEntryFormConfig, isFetched: configIsFetched } = useQuery(
        ['dataEntryFormConfig'],
        () => dataEngine.query(configQuery),
        {
            enabled: !!selectedScopeId,
            select: ({ dataEntryFormConfigQuery }) => dataEntryFormConfigQuery?.[selectedScopeId],
            cacheTime: Infinity,
            staleTime: Infinity,
        },
    );

    return {
        dataEntryFormConfig,
        configIsFetched,
    };
};
