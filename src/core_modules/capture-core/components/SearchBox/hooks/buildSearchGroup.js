// @flow
import { getUserStorageController } from '../../../storageControllers';
import { userStores } from '../../../storageControllers/stores';
import { SearchGroupFactory } from '../../../metaDataMemoryStoreBuilders/common/factory';
import type {
    ProgramTrackedEntityAttribute,
    TrackedEntityAttribute,
} from '../../WidgetProfile/DataEntry/FormFoundation/types';

type SearchProgramOrTET = {
    minAttributesRequiredToSearch: number,
    programTrackedEntityAttributes: Array<ProgramTrackedEntityAttribute>,
    trackedEntityTypeAttributes: Array<TrackedEntityAttribute>,
}

export const buildSearchGroup = async ({
    minAttributesRequiredToSearch,
    programTrackedEntityAttributes,
    trackedEntityTypeAttributes,
}: SearchProgramOrTET, locale: string) => {
    const storageController = getUserStorageController();
    const searchAttributes = programTrackedEntityAttributes ?? trackedEntityTypeAttributes;

    const trackedEntityAttributes = await storageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: trackedEntityAttribute => searchAttributes
            .some(tea => tea.trackedEntityAttributeId === trackedEntityAttribute.id),
    });

    const optionSets = await storageController.getAll(userStores.OPTION_SETS, {
        predicate: optionSet => trackedEntityAttributes
            ?.some(tea => tea.optionSet?.id === optionSet.trackedEntityAttributeId),
    });

    const searchGroupFactory = new SearchGroupFactory({
        cachedTrackedEntityAttributes: new Map(trackedEntityAttributes.map(tea => [tea.id, tea])),
        cachedOptionSets: new Map(optionSets.map(optionSet => [optionSet.id, optionSet])),
        locale,
    });

    const SearchGroup = await searchGroupFactory.build(
        searchAttributes,
        minAttributesRequiredToSearch,
    );

    return SearchGroup;
};
