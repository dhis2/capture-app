// @flow
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { SearchGroupFactory } from '../../metaDataMemoryStoreBuilders/common/factory';
import { useProgramFromIndexedDB } from './useProgramFromIndexedDB';
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';
import { buildSearchOption } from '../../hooks/useSearchOptions';
import { useTrackedEntityTypeFromIndexedDB } from './useTrackedEntityTypeFromIndexedDB';
import { useUserLocale } from '../localeData/useUserLocale';
import type { TrackedEntityAttributes } from '../../../capture-core-utils/rulesEngine';
import type { ProgramTrackedEntityAttribute } from '../../components/WidgetProfile/DataEntry/FormFoundation/types';
import type { SearchGroups } from '../../components/Pages/Search/SearchPage.types';

type SearchProgramOrTET = {|
    minAttributesRequiredToSearch: number,
    programTrackedEntityAttributes: Array<ProgramTrackedEntityAttribute>,
    trackedEntityTypeAttributes: TrackedEntityAttributes,
|}

const buildSearchGroup = async (searchProgramOrTET: SearchProgramOrTET, locale: string) => {
    const {
        minAttributesRequiredToSearch,
        programTrackedEntityAttributes,
        trackedEntityTypeAttributes,
    } = searchProgramOrTET;
    const storageController = getUserStorageController();

    const optionSets = await storageController.getAll(userStores.OPTION_SETS);
    const trackedEntityAttributes = await storageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES);

    const searchGroupFactory = new SearchGroupFactory({
        cachedTrackedEntityAttributes: new Map(trackedEntityAttributes.map(tea => [tea.id, tea])),
        cachedOptionSets: new Map(optionSets.map(optionSet => [optionSet.id, optionSet])),
        locale,
    });

    const SearchGroup = await searchGroupFactory.build(
        programTrackedEntityAttributes ?? trackedEntityTypeAttributes,
        minAttributesRequiredToSearch,
    );

    return SearchGroup;
};

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

    const { data: searchOption, isLoading, isError, error } = useQuery(
        ['searchGroup', searchId],
        // $FlowFixMe - flow does not understand that searchScope is not null here
        () => buildSearchGroup(searchData, locale),
        {
            enabled: !!(searchId && locale && searchData),
            select: (searchGroups: SearchGroups) => {
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
        searchOption,
        isLoading,
        isError,
        error,
    };
};
