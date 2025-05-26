// @flow
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../../../storageControllers';

export const getOptionSets = (optionSetIds: Array<string>) => {
    const storageController = getUserMetadataStorageController();
    return storageController.getAll(USER_METADATA_STORES.OPTION_SETS, {
        predicate: optionSet => optionSetIds.includes(optionSet.id),
    });
};
