// @flow
import { pipe } from 'capture-core-utils';
import { convertDataTypeValueToRequest } from './basicDataTypeConverters';
import type { OptionSetFilterData } from '../../../../../EventsList/eventList.types';
import { typeof dataElementTypes } from '../../../../../../../../metaData';

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
