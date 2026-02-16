import {
    convertText,
    convertDate,
    convertAssignee,
    convertBoolean,
    convertNumeric,
    convertOrgUnit,
    convertTrueOnly,
} from './converters';
import { isEqual } from '../../../../../utils/valueEqualityChecker';
import type { OptionSetFilterData, FilterData, Options } from '../../../../FiltersForTypes';
import { filterTypesObject } from '../../filters.const';

const convertersForTypes: any = {
    [filterTypesObject.AGE]: convertDate,
    [filterTypesObject.ASSIGNEE]: convertAssignee,
    [filterTypesObject.BOOLEAN]: convertBoolean,
    [filterTypesObject.COORDINATE]: convertText,
    [filterTypesObject.DATE]: convertDate,
    [filterTypesObject.DATETIME]: convertDate,
    [filterTypesObject.EMAIL]: convertText,
    [filterTypesObject.FILE_RESOURCE]: convertText,
    [filterTypesObject.IMAGE]: convertText,
    [filterTypesObject.INTEGER]: convertNumeric,
    [filterTypesObject.INTEGER_NEGATIVE]: convertNumeric,
    [filterTypesObject.INTEGER_POSITIVE]: convertNumeric,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
    [filterTypesObject.LONG_TEXT]: convertText,
    [filterTypesObject.NUMBER]: convertNumeric,
    [filterTypesObject.ORGANISATION_UNIT]: convertOrgUnit,
    [filterTypesObject.PERCENTAGE]: convertText,
    [filterTypesObject.PHONE_NUMBER]: convertText,
    [filterTypesObject.TEXT]: convertText,
    [filterTypesObject.TIME]: convertDate,
    [filterTypesObject.TRUE_ONLY]: convertTrueOnly,
    [filterTypesObject.URL]: convertText,
    [filterTypesObject.USERNAME]: convertText,
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
