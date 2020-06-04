// @flow
import { pipe } from 'capture-core-utils';
import { convertDataTypeValueToRequest } from './basicDataTypeConverters';
import { dataElementTypes as elementTypes } from '../../../../../../../../metaData';
import type { OptionSetFilterData } from '../../../../../../../ListView';

export function convertOptionSet(
    sourceValue: OptionSetFilterData,
    type: $Values<typeof elementTypes>,
) {
    return pipe(
        values => values.map(filterValue => convertDataTypeValueToRequest(filterValue, type)),
        values => values.join(';'),
        valueString => `in:${valueString}`,
    )(sourceValue.values);
}
