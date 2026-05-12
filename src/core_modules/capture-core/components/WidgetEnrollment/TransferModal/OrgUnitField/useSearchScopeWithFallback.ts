import { useMemo } from 'react';
import { useApiMetadataQuery } from '../../../../utils/reactQueryHelpers';
import { CurrentUser } from '../../../../utils/userInfo/CurrentUser';

type Props = {
    searchText?: string;
};

export const useSearchScopeWithFallback = ({ searchText }: Props) => {
    const orgUnitRootsFromUser = useMemo(() => {
        const { teiSearchOrganisationUnits, organisationUnits } = CurrentUser.get();
        return teiSearchOrganisationUnits.length ? teiSearchOrganisationUnits : organisationUnits;
    }, []);

    const { data: searchOrgUnits, isInitialLoading: isInitialLoadingSearch } = useApiMetadataQuery(
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
            cacheTime: 120 * 60 * 1000,
            select: (data) => {
                const { organisationUnits } = data as any;
                return organisationUnits;
            },
        },
    );

    return {
        orgUnitRoots: searchText?.length ? searchOrgUnits : orgUnitRootsFromUser,
        isLoading: searchText?.length ? isInitialLoadingSearch : false,
    };
};
