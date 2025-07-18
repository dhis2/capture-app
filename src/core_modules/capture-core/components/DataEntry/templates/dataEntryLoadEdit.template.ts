import { addFormData } from '../../D2Form/actions/form.actions';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { loadEditDataEntry } from '../actions/dataEntry.actions';
import { getDataEntryMeta, getDataEntryValues, getFormValues, validateDataEntryValues, getDataEntryNotes } from '../actions/dataEntryLoad.utils';
import type { RenderFoundation } from '../../../metaData';
import type { DataEntryPropToInclude } from '../actions/dataEntryLoad.utils';

export async function loadEditDataEntryAsync(
    dataEntryId: string,
    itemId: string,
    clientValuesForDataEntry: Record<string, any>,
    clientValuesForForm: Record<string, any>,
    dataEntryPropsToInclude: Array<DataEntryPropToInclude> | null,
    formFoundation: RenderFoundation,
    attributeCategoryOptions?: Record<string, any>,
    extraProps?: Record<string, any> | null,
    onAddSubValues?: (preDataEntryValues: Record<string, any>, preFormValues: Record<string, any>, foundation: RenderFoundation) => Promise<{ formValues: Record<string, any>, dataEntryValues: Record<string, any> }>,
) {
    const dataEntryMeta = dataEntryPropsToInclude ? getDataEntryMeta(dataEntryPropsToInclude) : {};
    const dataEntryNotes = getDataEntryNotes(clientValuesForDataEntry);
    const preDataEntryValues =
        dataEntryPropsToInclude ? getDataEntryValues(dataEntryPropsToInclude, clientValuesForDataEntry) : {};
    const preFormValues = getFormValues(clientValuesForForm, formFoundation);
    const key = getDataEntryKey(dataEntryId, itemId);
    const {
        dataEntryValues = { ...preDataEntryValues, ...attributeCategoryOptions },
        formValues = preFormValues,
    } = onAddSubValues ?
        (await onAddSubValues(preDataEntryValues, preFormValues, formFoundation)) ?? {} :
        {};

    const dataEntryUI =
        dataEntryPropsToInclude ? validateDataEntryValues(dataEntryValues, dataEntryPropsToInclude) : {};

    return {
        actions: [
            loadEditDataEntry({
                key,
                itemId,
                dataEntryId,
                dataEntryMeta,
                dataEntryValues,
                dataEntryNotes,
                extraProps,
                dataEntryUI,
            }),
            addFormData(key, formValues),
        ],
        dataEntryValues,
        formValues,
    };
}
