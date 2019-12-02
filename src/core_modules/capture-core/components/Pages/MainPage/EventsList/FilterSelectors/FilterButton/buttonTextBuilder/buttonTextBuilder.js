// @flow
import { dataElementTypes, OptionSet } from '../../../../../../../metaData';
import { convertDate } from './converters';

const convertersForTypes = {
    [dataElementTypes.DATE]: convertDate,
};

export function buildButtonText(
    filter: Object,
    type: $Values<typeof dataElementTypes>,
    optionSet: OptionSet,
) {
    
    return (convertersForTypes[type] ? convertersForTypes[type](filter) : filter);
}
