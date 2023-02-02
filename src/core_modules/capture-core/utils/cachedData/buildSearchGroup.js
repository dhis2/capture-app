// @flow
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';
import { SearchGroupFactory } from '../../metaDataMemoryStoreBuilders/common/factory';
import type {
    ProgramTrackedEntityAttribute,
    TrackedEntityAttribute,
} from '../../components/WidgetProfile/DataEntry/FormFoundation/types';

type SearchProgramOrTET = {|
    minAttributesRequiredToSearch: number,
    programTrackedEntityAttributes: Array<ProgramTrackedEntityAttribute>,
    trackedEntityTypeAttributes: Array<TrackedEntityAttribute>,
|}

export const buildSearchGroup = async (searchProgramOrTET: SearchProgramOrTET, locale: string) => {
    const {
        minAttributesRequiredToSearch,
        programTrackedEntityAttributes,
        trackedEntityTypeAttributes,
    } = searchProgramOrTET;
    const storageController = getUserStorageController();

    const trackedEntityAttributes = await storageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: (trackedEntityAttribute) => {
            const searchAttributes = programTrackedEntityAttributes ?? trackedEntityTypeAttributes;
            return searchAttributes
                .some(tea => tea.trackedEntityAttributeId === trackedEntityAttribute.id);
        },
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
        programTrackedEntityAttributes ?? trackedEntityTypeAttributes,
        minAttributesRequiredToSearch,
    );

    return SearchGroup;
};
