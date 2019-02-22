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

export function loadViewDataEntry(
    dataEntryId: string,
    itemId: string,
    clientValuesForDataEntry: Object,
    clientValuesForForm: Object,
    dataEntryPropsToInclude?: ?Array<DataEntryPropToInclude>,
    formFoundation: RenderFoundation,
    extraProps?: ?{ [key: string]: any },
) {
    const dataEntryMeta = dataEntryPropsToInclude ? getDataEntryMeta(dataEntryPropsToInclude) : {};
    const dataEntryValues =
        dataEntryPropsToInclude ? getDataEntryValues(dataEntryPropsToInclude, clientValuesForDataEntry) : {};

    const dataEntryUI = dataEntryPropsToInclude ? validateDataEntryValues(dataEntryValues, dataEntryPropsToInclude) : {};
    const formValues = getFormValues(clientValuesForForm, formFoundation);
    const key = getDataEntryKey(dataEntryId, itemId);
    return [
        actionCreator(actionTypes.LOAD_VIEW_DATA_ENTRY)({ key, itemId, dataEntryId, dataEntryMeta, dataEntryValues, extraProps, dataEntryUI }),
        addFormData(key, formValues),
    ];
}
