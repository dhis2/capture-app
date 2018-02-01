// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    UPDATE_SECTION_STATUS: UpdateSectionStatus,
};

export function updateSectionStatus(id: string, status: Object) {
    const payload = status;
    const meta = {
        id,
    };
    return actionCreator(actionTypes.UPDATE_SECTION_STATUS)(payload, meta);
}
