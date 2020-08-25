// @flow
import { dataElementTypes, OptionSet } from '../../../../../../metaData';
import {
    convertText,
    convertDate,
    convertAssignee,
    convertBoolean,
    convertNumeric,
    convertTrueOnly,
} from './converters';
import { isEqual } from '../../../../../../utils/valueEqualityChecker';
import type { OptionSetFilterData } from '../../../EventsList/eventList.types';

// todo (report lgmt)
const convertersForTypes = {
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.TEXT]: convertText,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.NUMBER]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_POSITIVE]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_NEGATIVE]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.DATE]: convertDate,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.ASSIGNEE]: convertAssignee,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.BOOLEAN]: convertBoolean,
    // $FlowFixMe[prop-missing] automated comment
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
    type: $Values<typeof dataElementTypes>,
    optionSet: OptionSet,
) {
    if (filter.usingOptionSet && optionSet) {
        return getOptionSetText(filter, optionSet);
    }

    return (convertersForTypes[type] ? convertersForTypes[type](filter) : filter);
}
