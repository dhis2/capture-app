// @flow
import { convertValue } from '../../../converters/formToClient';
import type { RenderFoundation } from '../../../metaData';
import { convertDataEntryValuesToClientValues } from './convertDataEntryValuesToClientValues';

export function convertDataEntryToClientValues(
    formFoundation: RenderFoundation,
    formValues: Object,
    dataEntryValues: Object,
    dataEntryValuesMeta: Object,
) {
    const formClientValues = formFoundation.convertValues(formValues, convertValue);
    const dataEntryClientValues = convertDataEntryValuesToClientValues(
        dataEntryValues,
        dataEntryValuesMeta,
        formFoundation,
    );

    return {
        formClientValues,
        dataEntryClientValues,
    };
}
