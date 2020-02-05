// @flow
import { pipe } from 'capture-core-utils';
import type { OptionSetFilterData } from '../../../../eventList.types';
import { convertDataTypeValueToRequest } from './basicDataTypeConverters';

export function convertOptionSet(
    sourceValue: OptionSetFilterData,
    type: string,
) {
    return pipe(
        values => values.map(filterValue => convertDataTypeValueToRequest(filterValue, type)),
        values =>
            (values.length > 1 ?
                { valueString: values.join(';'), single: false } :
                { valueString: values[0], single: true }
            ),
        ({ valueString, single }) => (single ? `eq:${valueString}` : `in:${valueString}`),
    )(sourceValue.values);
}
