import { pipe } from 'capture-core-utils';
import type { BooleanValueFilterData } from '../../../../../FiltersForTypes';

const booleanFilterValues = {
    true: 'true',
    false: 'false',
};

export function convertBoolean({ sourceValue }: { sourceValue: BooleanValueFilterData }) {
    return pipe(
        values => values.map(filterValue => booleanFilterValues[filterValue]),
        values =>
            (values.length > 1 ?
                { valueString: values.join(';'), single: false } :
                { valueString: values[0], single: true }
            ),
        ({ valueString, single }) => (single ? `eq:${valueString}` : `in:${valueString}`),
    )(sourceValue.values);
}
