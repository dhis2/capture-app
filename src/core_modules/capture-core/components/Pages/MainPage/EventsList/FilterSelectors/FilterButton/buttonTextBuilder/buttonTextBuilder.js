// @flow
import { dataElementTypes, OptionSet } from '../../../../../../../metaData';
import {
    convertText,
    convertDate,
    convertAssignee,
    convertBoolean,
    convertNumeric,
    convertTrueOnly,
} from './converters';
import { isEqual } from '../../../../../../../utils/valueEqualityChecker';
import type { OptionSetFilterData } from '../../../eventList.types';

const convertersForTypes = {
    [dataElementTypes.TEXT]: convertText,
    [dataElementTypes.NUMBER]: convertNumeric,
    [dataElementTypes.INTEGER]: convertNumeric,
    [dataElementTypes.INTEGER_POSITIVE]: convertNumeric,
    [dataElementTypes.INTEGER_NEGATIVE]: convertNumeric,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.ASSIGNEE]: convertAssignee,
    [dataElementTypes.BOOLEAN]: convertBoolean,
    [dataElementTypes.TRUE_ONLY]: convertTrueOnly,
};

function getOptionSetText(filter: OptionSetFilterData, optionSet: OptionSet) {
    const optionText = filter
        .values
        .map((value) => {
            const option = optionSet.options.find(o => isEqual(o.value, value));
            return option && option.text;
        })
        .filter(text => text)
        .join(', ');

    return optionText.length > 20 ? `${optionText.substring(0, 18)}..` : optionText;
}

export function buildButtonText(
    filter: any,
    type: DataElementTypes,
    optionSet: OptionSet,
) {
    if (filter.usingOptionSet && optionSet) {
        return getOptionSetText(filter, optionSet);
    }

    // $FlowFixMe elementTypes flow error
    return (convertersForTypes[type] ? convertersForTypes[type](filter) : filter);
}
