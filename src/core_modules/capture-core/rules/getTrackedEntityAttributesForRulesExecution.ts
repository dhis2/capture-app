import type { DataElement } from '../metaData';

type RuleAttribute = {
    id: string;
    valueType: string;
    optionSetId?: string;
};

export const getTrackedEntityAttributesForRulesExecution = (attributes: Array<DataElement>): Record<string, RuleAttribute> =>
    attributes.reduce((accRulesAttributes: Record<string, RuleAttribute>, attribute: DataElement) => {
        accRulesAttributes[attribute.id] = {
            id: attribute.id,
            valueType: attribute.type,
            optionSetId: attribute.optionSet?.id,
        };
        return accRulesAttributes;
    }, {});
