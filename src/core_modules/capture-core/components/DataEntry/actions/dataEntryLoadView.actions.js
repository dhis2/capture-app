// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { addFormData } from '../../D2Form/actions/form.actions';
import getDataEntryKey from '../common/getDataEntryKey';
import { getDataEntryMeta, getDataEntryValues, getFormValues, validateDataEntryValues } from './dataEntryLoad.utils';
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';

import type { DataEntryPropToInclude } from './dataEntryLoad.utils';

export const actionTypes = {
    LOAD_VIEW_DATA_ENTRY: 'LoadViewDataEntry',
};

// eslint-disable-next-line complexity
export async function loadViewDataEntry(
    dataEntryId: string,
    itemId: string,
    clientValuesForDataEntry: Object,
    clientValuesForForm: Object,
    dataEntryPropsToInclude?: ?Array<DataEntryPropToInclude>,
    formFoundation: RenderFoundation,
    extraProps?: ?{ [key: string]: any },
    onAddSubValues?: (preDataEntryValues: Object, preFormValues: Object, formFoundation: RenderFoundation) => { formValues?: ?Object, dataEntryValues?: ?Object },
) {
    const dataEntryMeta = dataEntryPropsToInclude ? getDataEntryMeta(dataEntryPropsToInclude) : {};
    const preDataEntryValues =
        dataEntryPropsToInclude ? getDataEntryValues(dataEntryPropsToInclude, clientValuesForDataEntry) : {};
    const preFormValues = getFormValues(clientValuesForForm, formFoundation);
    const key = getDataEntryKey(dataEntryId, itemId);

    const { dataEntryValues = preDataEntryValues, formValues = preFormValues } = onAddSubValues ?
        (await onAddSubValues(preDataEntryValues, preFormValues, formFoundation)) || {} :
        {};

    const dataEntryUI =
        dataEntryPropsToInclude ? validateDataEntryValues(dataEntryValues, dataEntryPropsToInclude) : {};

    return [
        actionCreator(actionTypes.LOAD_VIEW_DATA_ENTRY)({
            key,
            itemId,
            dataEntryId,
            dataEntryMeta,
            dataEntryValues,
            extraProps,
            dataEntryUI,
        }),
        addFormData(key, formValues),
    ];
}
