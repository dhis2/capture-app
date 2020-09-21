// @flow
import { pipe } from 'capture-core-utils';
import { convertDataTypeValueToRequest } from './basicDataTypeConverters';
import type { OptionSetFilterData } from '../../../../../EventsList/eventList.types';
import { dataElementTypes } from '../../../../../../../../metaData';

export function convertOptionSet(
    sourceValue: OptionSetFilterData,
    type: $Keys<typeof dataElementTypes>,
) {
    return pipe(
        values => values.map(filterValue => convertDataTypeValueToRequest(filterValue, type)),
        values => values.join(';'),
        valueString => `in:${valueString}`,
    )(sourceValue.values);
}
