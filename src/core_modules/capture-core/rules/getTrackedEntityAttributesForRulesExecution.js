// @flow
import type { DataElement } from '../metaData';

export const getTrackedEntityAttributesForRulesExecution = (attributes: Array<DataElement>) =>
    attributes.reduce((accRulesAttributes, attribute) => {
        accRulesAttributes[attribute.id] = {
            id: attribute.id,
            valueType: attribute.type,
            optionSetId: attribute.optionSet && attribute.optionSet.id,
        };
        return accRulesAttributes;
    }, {});
