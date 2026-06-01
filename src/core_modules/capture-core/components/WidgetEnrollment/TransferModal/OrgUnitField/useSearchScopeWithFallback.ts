import { useApiMetadataQuery } from '../../../../utils/reactQueryHelpers';

type Props = {
    searchText?: string;
};

type OrgUnit = { id: string; path: string };
type MeOrgUnitScope = {
    teiSearchOrganisationUnits: Array<OrgUnit>;
    organisationUnits: Array<OrgUnit>;
};
type OrgUnitsResponse = { organisationUnits: Array<OrgUnit> };

export const useSearchScopeWithFallback = ({ searchText }: Props) => {
    const { data: orgUnitRoots, isInitialLoading } = useApiMetadataQuery<MeOrgUnitScope, Array<OrgUnit>>(
        ['organisationUnits', 'userOrgUnitScope'],
        {
            resource: 'me',
            params: {
                fields: 'teiSearchOrganisationUnits[id,path],organisationUnits[id,path]',
            },
        },
        {
            enabled: !searchText,
            select: ({ teiSearchOrganisationUnits, organisationUnits }) =>
                (teiSearchOrganisationUnits.length ? teiSearchOrganisationUnits : organisationUnits),
        },
    );

    const {
        data: searchOrgUnits,
        isInitialLoading: isInitialLoadingSearch,
    } = useApiMetadataQuery<OrgUnitsResponse, Array<OrgUnit>>(
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
            select: ({ organisationUnits }) => organisationUnits,
        },
    );

    return {
        orgUnitRoots: searchText?.length ? searchOrgUnits : orgUnitRoots,
        isLoading: searchText?.length ? isInitialLoadingSearch : isInitialLoading,
    };
};
