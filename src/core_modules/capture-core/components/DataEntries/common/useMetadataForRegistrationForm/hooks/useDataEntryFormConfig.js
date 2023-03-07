// @flow

import { useDataEngine } from '@dhis2/app-runtime';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

type Props = {|
    selectedScopeId: string,
|}

export const useDataEntryFormConfig = ({ selectedScopeId }: Props) => {
    const dataEngine = useDataEngine();

    const configQuery = useMemo(() => ({
        dataEntryFormConfigQuery: {
            resource: 'dataStore/capture/dataEntryForms',
        },
    }), []);

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
