// @flow

import { useApiMetadataQuery } from '../../../../../../utils/reactQueryHelpers';

type Props = {|
    selectedScopeId: string,
|}

const configQuery = {
    resource: 'dataStore/capture/dataEntryForms',
};

export const useDataEntryFormConfig = ({ selectedScopeId }: Props) => {
    const { data: dataEntryFormConfig, isFetched: configIsFetched } = useApiMetadataQuery(
        ['dataEntryFormConfig', selectedScopeId],
        configQuery,
        {
            enabled: !!selectedScopeId,
            select: dataEntryFormConfigQuery => dataEntryFormConfigQuery[selectedScopeId],
        },
    );

    return {
        dataEntryFormConfig,
        configIsFetched,
    };
};
