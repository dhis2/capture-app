// @flow

import { useApiMetadataQuery } from '../../../../utils/reactQueryHelpers';

type Props = {
    searchText: ?string,
};

export const useSearchScopeWithFallback = ({ searchText }: Props) => {
    const { data: orgUnitRoots, isLoading } = useApiMetadataQuery(
        ['organisationUnits', 'userOrgUnitScope'],
        {
            resource: 'me',
            params: {
                fields: 'teiSearchOrganisationUnits[id,path],organisationUnits[id,path]',
            },
        },
        {
            enabled: !searchText,
            select: (data) => {
                const { teiSearchOrganisationUnits, organisationUnits } = data;
                return teiSearchOrganisationUnits.length
                    ? teiSearchOrganisationUnits
                    : organisationUnits;
            },
        },
    );

    const { data: searchOrgUnits, isLoading: isLoadingSearch } = useApiMetadataQuery(
        // $FlowFixMe - react-query types are not up to date
        ['organisationUnits', 'userOrgUnitScope', 'search', searchText],
        {
            resource: 'organisationUnits',
            params: {
                fields: ['id,path'],
                paging: true,
                query: searchText,
                withinUserSearchHierarchy: true,
                pageSize: 15,
            },
        },
        {
            enabled: Boolean(searchText),
            select: (data) => {
                const { organisationUnits } = data;
                return organisationUnits;
            },
        },
    );

    return {
        orgUnitRoots: searchText?.length ? searchOrgUnits : orgUnitRoots,
        isLoading: searchText?.length ? isLoadingSearch : isLoading,
    };
};
