// @flow
import {
    convertText,
    convertDate,
    convertAssignee,
    convertBoolean,
    convertNumeric,
    convertTrueOnly,
} from './converters';
import { isEqual } from '../../../../../utils/valueEqualityChecker';
import type { OptionSetFilterData, Options } from '../../../../FiltersForTypes';
import { filterTypesObject } from '../../filterTypes';

// todo (report lgmt)
const convertersForTypes = {
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.TEXT]: convertText,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.NUMBER]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.INTEGER]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.INTEGER_POSITIVE]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.INTEGER_NEGATIVE]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.DATE]: convertDate,
    // $FlowFixMe
    [filterTypesObject.ASSIGNEE]: convertAssignee,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.BOOLEAN]: convertBoolean,
    // $FlowFixMe[prop-missing] automated comment
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
    filter: any,
    type: $Values<typeof filterTypesObject>,
    options?: ?Options,
) {
    if (filter.usingOptionSet && options) {
        return getOptionSetText(filter, options);
    }

    return (convertersForTypes[type] ? convertersForTypes[type](filter) : filter);
}
