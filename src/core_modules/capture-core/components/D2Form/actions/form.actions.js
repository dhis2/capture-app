// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    ADD_FORM_DATA: 'AddFormData',
};

export function addFormData(formId: string, formValues: $Shape<{||}> = {}) {
    return actionCreator(actionTypes.ADD_FORM_DATA)({ formValues, formId });
}
