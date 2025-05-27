// @flow
import { getUserStorageController } from '../../../../../../storageControllers';
import { userStores } from '../../../../../../storageControllers/stores';

export const getOptionSets = (optionSetIds: Array<string>) => {
    const storageController = getUserStorageController();
    return storageController.getAll(userStores.OPTION_SETS, {
        predicate: optionSet => optionSetIds.includes(optionSet.id),
    });
};
