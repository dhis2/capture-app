// @flow
import { useQuery } from 'react-query';
import { SearchGroupFactory } from '../../metaDataMemoryStoreBuilders/common/factory';
import { useProgramFromIndexedDB } from './useProgramFromIndexedDB';
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';

const buildSearchGroup = async (program) => {
    const storageController = getUserStorageController();
    const optionSets = await storageController.getAll(userStores.OPTION_SETS);

    const searchGroupFactory = new SearchGroupFactory({
        cachedTrackedEntityAttributes: program?.programTrackedEntityAttributes,
        cachedOptionSets: optionSets,
        locale: 'en',
    });

    const SearchGroup = await searchGroupFactory.build(
        program.programTrackedEntityAttributes,
        program.minAttributesRequiredToSearch,
    );

    return SearchGroup;
};

export const useSearchGroupForProgram = (programId: string) => {
    const { program: data } = useProgramFromIndexedDB('IpHINAT79UW');


    const { data: searchGroups, isLoading, error } = useQuery(
        ['searchGroup', programId],
        () => buildSearchGroup(data),
        {
            enabled: !!(data),
        },
    );

    console.log('searchGroup', searchGroups);
    console.log('error', error);

    return {
        data,
    };
};
