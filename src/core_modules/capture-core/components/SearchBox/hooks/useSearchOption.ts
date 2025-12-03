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

// eslint-disable-next-line complexity
export const useSearchOption = ({
    programId,
    trackedEntityTypeId,
}: Props): { searchOption?: AvailableSearchOption; isLoading: boolean; isError: boolean } => {
    const { locale } = useUserLocale();

    const searchScope = useMemo(() => {
        if (programId) {
            return searchScopes.PROGRAM;
        } else if (trackedEntityTypeId) {
            return searchScopes.TRACKED_ENTITY_TYPE;
        }
        return null;
    }, [programId, trackedEntityTypeId]);

    const { program: programData, isLoading: isLoadingProgram, isError: isErrorProgram } = useProgramFromIndexedDB(
        programId,
        { enabled: !!(searchScope === searchScopes.PROGRAM && programId) },
    );
    const {
        trackedEntityType: trackedEntityTypeData,
        isLoading: isLoadingTrackedEntityType,
        isError: isErrorTrackedEntityType,
    } = useTrackedEntityTypeFromIndexedDB(
        trackedEntityTypeId,
        { enabled: !!(searchScope === searchScopes.TRACKED_ENTITY_TYPE && trackedEntityTypeId) },
    );

    const searchData = (programData ?? trackedEntityTypeData);
    const { id: searchId, displayName: searchName } = searchData ?? {};

    const {
        data: searchGroups,
        isLoading: isLoadingSearchGroups,
        isError: isErrorSearchGroups,
    } = useIndexedDBQuery<SearchGroup[]>(
        ['searchGroup', searchId],
        () => buildSearchGroup(searchData, locale),
        {
            enabled: !!(searchId && locale && searchData),
        },
    );

    const isLoading = isLoadingProgram || isLoadingTrackedEntityType || isLoadingSearchGroups;
    const isError = isErrorProgram || isErrorTrackedEntityType || isErrorSearchGroups;

    const searchOption = useMemo(() => {
        if (!searchName || !searchGroups || !searchScope) {
            return undefined;
        }
        return buildSearchOption(
            searchId,
            searchName,
            searchGroups as any,
            searchScope,
        );
    }, [searchName, searchGroups, searchScope, searchId]);

    return {
        searchOption,
        isLoading,
        isError,
    };
};
