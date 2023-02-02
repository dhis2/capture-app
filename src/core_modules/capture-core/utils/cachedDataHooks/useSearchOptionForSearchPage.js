// @flow
import { useMemo } from 'react';
import { useProgramFromIndexedDB } from './useProgramFromIndexedDB';
import { buildSearchOption } from '../../hooks/useSearchOptions';
import { useTrackedEntityTypeFromIndexedDB } from './useTrackedEntityTypeFromIndexedDB';
import { useUserLocale } from '../localeData/useUserLocale';
import type { AvailableSearchOption, SearchGroups } from '../../components/Pages/Search/SearchPage.types';
import { useIndexedDBQuery } from '../reactQueryHelpers';
import { buildSearchGroup } from '../cachedData';

const searchScopes = {
    PROGRAM: 'PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

type Props = {|
    trackedEntityTypeId: ?string,
    programId: ?string,
|};


export const useSearchOptionForSearchPage = ({ programId, trackedEntityTypeId }: Props) => {
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

    const { data, isLoading, isError, error } = useIndexedDBQuery<?AvailableSearchOption>(
        ['searchGroup', searchId],
        // $FlowFixMe - flow does not understand that searchScope is not null here
        () => buildSearchGroup(searchData, locale),
        {
            enabled: !!(searchId && locale && searchData),
            // $FlowFixMe - flow does not understand select
            select: (searchGroups: ?SearchGroups) => {
                if (!searchName || !searchGroups || !searchScope) {
                    return undefined;
                }
                return buildSearchOption(
                    searchId,
                    searchName,
                    searchGroups,
                    searchScope,
                );
            },
        },
    );


    return {
        searchOption: data ?? {},
        isLoading,
        isError,
        error,
    };
};
