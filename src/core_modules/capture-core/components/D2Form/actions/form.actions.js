// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
  FORM_DATA_ADD: 'AddFormData',
  FORM_DATA_REMOVE: 'RemoveFormData',
};

export function addFormData(formId: string, formValues: Object = {}) {
  return actionCreator(actionTypes.FORM_DATA_ADD)({ formValues, formId });
}

export function removeFormData(formId: string) {
  return actionCreator(actionTypes.FORM_DATA_REMOVE)({ formId });
}
