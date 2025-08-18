import type { BooleanFilterData } from '../../../../../ListView';

const booleanFilterValues = {
    true: 'true',
    false: 'false',
};

export function convertBoolean({ sourceValue }: { sourceValue: BooleanFilterData }) {
    const values = (sourceValue.values as any[]).map(filterValue => booleanFilterValues[filterValue]);
    const result = values.length > 1 ?
        { valueString: values.join(';'), single: false } :
        { valueString: values[0], single: true };
    return result.single ? `eq:${result.valueString}` : `in:${result.valueString}`;
}
