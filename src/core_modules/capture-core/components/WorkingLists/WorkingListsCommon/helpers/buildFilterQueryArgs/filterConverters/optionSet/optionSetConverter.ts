import { pipe } from 'capture-core-utils';
import { convertDataTypeValueToRequest } from './basicDataTypeConverters';
import { dataElementTypes } from '../../../../../../../metaData';
import type { OptionSetFilterData } from '../../../../../../ListView';
import { escapeString } from '../../../../../../../utils/escapeString';

export function convertOptionSet(
    sourceValue: OptionSetFilterData,
    type: keyof typeof dataElementTypes,
) {
    return pipe(
        values => values.map(filterValue => escapeString(convertDataTypeValueToRequest(filterValue, type))),
        values => values.join(';'),
        valueString => `in:${valueString}`,
    )(sourceValue.values);
}
