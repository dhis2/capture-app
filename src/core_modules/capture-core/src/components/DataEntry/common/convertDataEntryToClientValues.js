// @flow
import { convertValue } from '../../../converters/formToClient';
import convertDataEntryValuesToClientValues from './convertDataEntryValuesToClientValues';
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';

export default function convertDataEntryToClientValues(
    formFoundation: RenderFoundation,
    formValues: Object,
    dataEntryValues: Object,
    dataEntryValuesMeta: Object,
    previousData: Object,
) {
    const formClientValues = formFoundation.convertValues(formValues, convertValue);
    const dataEntryClientValues = convertDataEntryValuesToClientValues(
        dataEntryValues,
        dataEntryValuesMeta,
        previousData,
        formFoundation,
    );

    return {
        formClientValues,
        dataEntryClientValues,
    };
}
