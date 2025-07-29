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
import { dataElementTypes } from '../../../../../metaData';

const convertersForTypes: any = {
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

function getOptionSetText(filter: OptionSetFilterData, options: Options): string {
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
    type: string,
    options?: Options | null,
): string {
    if ((filter as any).usingOptionSet && options) {
        return getOptionSetText(filter as OptionSetFilterData, options);
    }

    return convertersForTypes[type](filter as any);
}
