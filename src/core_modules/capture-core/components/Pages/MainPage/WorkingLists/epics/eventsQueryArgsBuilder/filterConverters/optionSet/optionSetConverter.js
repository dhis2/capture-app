// @flow
import { pipe } from 'capture-core-utils';
import { convertDataTypeValueToRequest } from './basicDataTypeConverters';
import type { OptionSetFilterData } from '../../../../../EventsList/eventList.types';

export function convertOptionSet(
    sourceValue: OptionSetFilterData,
    type: DataElementTypes,
) {
    return pipe(
        values => values.map(filterValue => convertDataTypeValueToRequest(filterValue, type)),
        values => values.join(';'),
        valueString => `in:${valueString}`,
    )(sourceValue.values);
}
