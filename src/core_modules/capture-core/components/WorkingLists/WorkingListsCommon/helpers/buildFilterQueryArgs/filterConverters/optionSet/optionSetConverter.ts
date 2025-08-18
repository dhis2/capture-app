import { convertDataTypeValueToRequest } from './basicDataTypeConverters';
import { dataElementTypes } from '../../../../../../../metaData';
import type { OptionSetFilterData } from '../../../../../../ListView';
import { escapeString } from '../../../../../../../utils/escapeString';

export function convertOptionSet(
    sourceValue: OptionSetFilterData,
    type: keyof typeof dataElementTypes,
) {
    const values = (sourceValue.values as any[]).map(filterValue => escapeString(convertDataTypeValueToRequest(filterValue, type)));
    const joinedValues = values.join(';');
    return `in:${joinedValues}`;
}
