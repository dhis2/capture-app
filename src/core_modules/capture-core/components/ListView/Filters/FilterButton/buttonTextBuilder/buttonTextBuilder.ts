import {
    convertText,
    convertDate,
    convertAssignee,
    convertBoolean,
    convertNumeric,
    convertTrueOnly,
} from './converters';
import { isEqual } from '../../../../../utils/valueEqualityChecker';
import type { OptionSetFilterData, FilterData, Options } from '../../../../FiltersForTypes';
import { filterTypesObject } from '../../filters.const';

const convertersForTypes: any = {
    [filterTypesObject.TEXT]: convertText,
    [filterTypesObject.NUMBER]: convertNumeric,
    [filterTypesObject.INTEGER]: convertNumeric,
    [filterTypesObject.INTEGER_POSITIVE]: convertNumeric,
    [filterTypesObject.INTEGER_NEGATIVE]: convertNumeric,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
    [filterTypesObject.DATE]: convertDate,
    [filterTypesObject.ASSIGNEE]: convertAssignee,
    [filterTypesObject.BOOLEAN]: convertBoolean,
    [filterTypesObject.TRUE_ONLY]: convertTrueOnly,
};

function getOptionSetText(filter: OptionSetFilterData, options: Options) {
    const optionText = filter
        .values
        .map((value) => {
            const option = options.find(o => isEqual(o.value, value));
            return option && option.text;
        })
        .filter(text => text)
        .join(', ');

    return optionText.length > 20 ? `${optionText.substring(0, 18)}..` : optionText;
}

export function buildButtonText(
    filter: FilterData,
    type: typeof filterTypesObject[keyof typeof filterTypesObject],
    options?: Options | null,
): string {
    if ('usingOptionSet' in filter && options) {
        return getOptionSetText(filter, options);
    }

    return convertersForTypes[type](filter);
}
