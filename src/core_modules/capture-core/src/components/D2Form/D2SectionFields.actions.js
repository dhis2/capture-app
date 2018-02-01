// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    UPDATE_FIELD: 'UpdateField',
};

export const updateField = (containerId: string, elementId: string, value: any) => {
    const payload = value;
    const meta = {
        containerId,
        elementId,
    };
    return actionCreator(actionTypes.UPDATE_FIELD)(payload, meta);
};
