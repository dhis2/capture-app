// @flow
import { pipe } from 'capture-core-utils';
import { typeof dataElementTypes } from '../../../../../../../metaData';
import type { OptionSetFilterData } from '../../../../../../ListView';
import { convertDataTypeValueToRequest } from './basicDataTypeConverters';

export function convertOptionSet(
    sourceValue: OptionSetFilterData,
    type: $Keys<dataElementTypes>,
) {
    return pipe(
        values => values.map(filterValue => convertDataTypeValueToRequest(filterValue, type)),
        values => values.join(';'),
        valueString => `in:${valueString}`,
    )(sourceValue.values);
}
