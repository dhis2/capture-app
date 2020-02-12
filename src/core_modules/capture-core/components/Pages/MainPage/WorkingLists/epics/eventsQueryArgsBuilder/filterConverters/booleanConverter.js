// @flow
import { pipe } from 'capture-core-utils';
import type { BooleanFilterData } from '../../../eventList.types';

export function convertBoolean(filter: BooleanFilterData) {
    return pipe(
        values => values.map(filterValue => (filterValue ? 'true' : 'false')),
        values =>
            (values.length > 1 ?
                { valueString: values.join(';'), single: false } :
                { valueString: values[0], single: true }
            ),
        ({ valueString, single }) => (single ? `eq:${valueString}` : `in:${valueString}`),
    )(filter.values);
}
