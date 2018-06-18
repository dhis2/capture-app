// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    EDIT_CONTENTS: 'EditFilterSelectorContentsForWorkingList',
    SET_FILTER: 'SetWorkingListFilter',
};

export const editContents = (value: any, itemId: string) =>
    actionCreator(actionTypes.EDIT_CONTENTS)({ value, itemId });

export const setFilter = (requestData: any, appliedText: string, itemId: string) =>
    actionCreator(actionTypes.SET_FILTER)({ requestData, appliedText, itemId });
