import { pipe } from 'capture-core-utils';
import { convertDataTypeValueToRequest } from './basicDataTypeConverters';
import { dataElementTypes } from '../../../../../../../metaData';
import type { OptionSetFilterData } from '../../../../../../ListView';
import { escapeString } from '../../../../../../../utils/escapeString';

export function convertOptionSet(
    sourceValue: OptionSetFilterData,
    type: keyof typeof dataElementTypes,
) {
    return pipe(
        (values: any[]) => values.map(filterValue => escapeString(convertDataTypeValueToRequest(filterValue, type))),
        (values: string[]) => values.join(';'),
        (valueString: string) => `in:${valueString}`,
    )(sourceValue.values);
}
