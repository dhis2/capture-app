// @flow
import { getOptionSets } from '../getFunctions/getOptionSets';
import { useIndexedDBQuery } from '../../../../../../utils/reactQueryHelpers';
import type { CachedTrackedEntityAttribute } from '../../../../../../storageControllers/cache.types';

type Props = {
    selectedScopeId: string,
    attributes: ?Array<CachedTrackedEntityAttribute>,
};

export const useOptionSetsForAttributes = ({ attributes, selectedScopeId }: Props) => {
    const { data: cachedOptionSets } = useIndexedDBQuery(
        ['optionSets', selectedScopeId],
        () => getOptionSets(attributes
            ?.reduce((acc, attribute) => {
                if (attribute.optionSet) {
                    acc.push(attribute.optionSet.id);
                }
                return acc;
            }, []) ?? []),
        {
            enabled: !!attributes,
        });

    return {
        optionSets: cachedOptionSets,
    };
};
