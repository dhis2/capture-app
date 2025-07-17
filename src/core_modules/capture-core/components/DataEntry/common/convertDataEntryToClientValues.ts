import { convertDataEntryValuesToClientValues } from './convertDataEntryValuesToClientValues';
import type { RenderFoundation } from '../../../metaData';

export function convertDataEntryToClientValues(
    formFoundation: RenderFoundation,
    formValues: any,
    dataEntryValues: any,
    dataEntryValuesMeta: any,
) {
    const formClientValues = formFoundation.convertValues(formValues);
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
