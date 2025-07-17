import { convertValue } from '../../../converters/formToClient';
import { convertDataEntryValuesToClientValues } from './convertDataEntryValuesToClientValues';
import type { RenderFoundation } from '../../../metaData';

export function convertDataEntryToClientValues(
    formFoundation: RenderFoundation,
    formValues: any,
    dataEntryValues: any,
    dataEntryValuesMeta: any,
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
