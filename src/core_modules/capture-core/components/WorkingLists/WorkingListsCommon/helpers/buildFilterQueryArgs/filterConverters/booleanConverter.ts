import { pipe } from 'capture-core-utils';
import type { BooleanFilterData } from '../../../../../ListView';

const booleanFilterValues = {
    true: 'true',
    false: 'false',
};

export function convertBoolean({ sourceValue }: { sourceValue: BooleanFilterData }) {
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
