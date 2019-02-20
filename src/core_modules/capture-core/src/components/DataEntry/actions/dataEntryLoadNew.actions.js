// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { addFormData } from '../../D2Form/actions/form.actions';
import getDataEntryKey from '../common/getDataEntryKey';
import { getDataEntryMeta, validateDataEntryValues } from './dataEntryLoad.utils';

import type { DataEntryPropToInclude } from './dataEntryLoad.utils';

export const actionTypes = {
    LOAD_NEW_DATA_ENTRY: 'LoadNewDataEntry',
};

export function loadNewDataEntry(
    dataEntryId: string,
    itemId: string,
    dataEntryPropsToInclude?: ?Array<DataEntryPropToInclude>,
    defaultDataEntryValues?: ?Object,
) {
    const dataEntryValues = defaultDataEntryValues || {};
    const formValues = {};
    const dataEntryMeta = dataEntryPropsToInclude ? getDataEntryMeta(dataEntryPropsToInclude) : {};
    const dataEntryUI = dataEntryPropsToInclude ? validateDataEntryValues(dataEntryValues, dataEntryPropsToInclude) : {};
    const key = getDataEntryKey(dataEntryId, itemId);
    return [
        actionCreator(actionTypes.LOAD_NEW_DATA_ENTRY)({ key, itemId, dataEntryId, dataEntryMeta, dataEntryUI, dataEntryValues }),
        addFormData(key, formValues),
    ];
}
