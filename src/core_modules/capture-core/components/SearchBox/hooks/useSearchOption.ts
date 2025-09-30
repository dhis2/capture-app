import { useMemo } from 'react';
import { useProgramFromIndexedDB } from '../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { buildSearchOption } from '../../../hooks/useSearchOptions';
import { useTrackedEntityTypeFromIndexedDB } from '../../../utils/cachedDataHooks/useTrackedEntityTypeFromIndexedDB';
import { useUserLocale } from '../../../utils/localeData/useUserLocale';
import type { AvailableSearchOption } from '../SearchBox.types';
import type { SearchGroup } from '../../../metaData/SearchGroup/SearchGroup';
import { useIndexedDBQuery } from '../../../utils/reactQueryHelpers';
import { buildSearchGroup } from './index';

const searchScopes = {
    PROGRAM: 'PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

type Props = {
    trackedEntityTypeId?: string | null;
    programId?: string | null;
};

export const useSearchOption = ({
    programId,
    trackedEntityTypeId,
}: Props): {
    searchOption?: AvailableSearchOption;
    filteredUnsupportedAttributes: {
        id: string;
        displayName: string;
        valueType: string;
        searchable: boolean;
    }[];
    isLoading: boolean;
    isError: boolean
} => {
    const { locale } = useUserLocale();

    const searchScope = useMemo(() => {
        if (programId) {
            return searchScopes.PROGRAM;
        } else if (trackedEntityTypeId) {
            return searchScopes.TRACKED_ENTITY_TYPE;
        }
        return null;
    }, [programId, trackedEntityTypeId]);

    const { program: programData } = useProgramFromIndexedDB(
        programId,
        { enabled: !!(searchScope === searchScopes.PROGRAM && programId) },
    );
    const { trackedEntityType: trackedEntityTypeData } = useTrackedEntityTypeFromIndexedDB(
        trackedEntityTypeId,
        { enabled: !!(searchScope === searchScopes.TRACKED_ENTITY_TYPE && trackedEntityTypeId) },
    );

    const searchData = (programData ?? trackedEntityTypeData);
    const { id: searchId, displayName: searchName } = searchData ?? {};

    const { data: searchDataResult, isLoading, isError } = useIndexedDBQuery<{ searchGroups: SearchGroup[], filteredUnsupportedAttributes: any[] }>(
        ['searchGroup', searchId],
        () => buildSearchGroup(searchData, locale),
        {
            enabled: !!(searchId && locale && searchData),
        },
    );

    const searchOption = useMemo(() => {
        if (!searchName || !searchDataResult?.searchGroups || !searchScope) {
            return undefined;
        }
        return buildSearchOption(
            searchId,
            searchName,
            searchDataResult.searchGroups as any,
            searchScope,
        );
    }, [searchName, searchDataResult?.searchGroups, searchScope, searchId]);

    return {
        searchOption,
        filteredUnsupportedAttributes: searchDataResult?.filteredUnsupportedAttributes || [],
        isLoading,
        isError,
    };
};
