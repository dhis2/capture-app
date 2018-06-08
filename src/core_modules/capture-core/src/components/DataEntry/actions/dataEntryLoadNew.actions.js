// @flow
import { actionCreator } from '../../../actions/actions.utils';
import { addFormData } from '../../D2Form/actions/form.actions';
import getDataEntryKey from '../common/getDataEntryKey';
import { getDataEntryMeta } from './dataEntryLoad.utils';

import type { DataEntryPropToInclude } from './dataEntryLoad.utils';

export const actionTypes = {
    LOAD_NEW_DATA_ENTRY: 'LoadNewDataEntry',
};

export function loadNewDataEntry(
    dataEntryId: string,
    itemId: string,
    dataEntryPropsToInclude?: ?Array<DataEntryPropToInclude>,
) {
    const dataEntryMeta = dataEntryPropsToInclude ? getDataEntryMeta(dataEntryPropsToInclude) : {};
    const key = getDataEntryKey(dataEntryId, itemId);
    return [
        actionCreator(actionTypes.LOAD_NEW_DATA_ENTRY)({ key, itemId, dataEntryId, dataEntryMeta }),
        addFormData(key, {}),
    ];
}
