// @flow
import { useQuery } from 'react-query';
import { SearchGroupFactory } from '../../metaDataMemoryStoreBuilders/common/factory';
import { useProgramFromIndexedDB } from './useProgramFromIndexedDB';
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';

const buildSearchGroup = async (program) => {
    const storageController = getUserStorageController();

    const optionSets = await storageController.getAll(userStores.OPTION_SETS);
    const trackedEntityAttributes = await storageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES);

    const searchGroupFactory = new SearchGroupFactory({
        cachedTrackedEntityAttributes: new Map(trackedEntityAttributes.map(tea => [tea.id, tea])),
        cachedOptionSets: new Map(optionSets.map(optionSet => [optionSet.id, optionSet])),
        locale: 'en',
    });

    const SearchGroup = await searchGroupFactory.build(
        program.programTrackedEntityAttributes,
        program.minAttributesRequiredToSearch,
    );

    return SearchGroup;
};


export const useSearchGroupForProgram = (programId: string) => {
    const { program: data } = useProgramFromIndexedDB(programId);

    const { data: searchGroups, isLoading, error } = useQuery(
        ['searchGroup', programId],
        () => buildSearchGroup(data),
        {
            enabled: !!(data),
        },
    );

    return {
        searchGroups,
        isLoading,
        error,
    };
};
