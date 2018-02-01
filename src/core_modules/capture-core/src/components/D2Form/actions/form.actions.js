// @flow
import log from 'loglevel';
import { ensureState } from 'redux-optimistic-ui';

import metaDataCollection from '../../../metaData/programCollection/programCollection';
import { valueConvertersForType } from '../../../converters/clientToForm';
import errorCreator from '../../../utils/errorCreator';
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    ADD_FORM_DATA: 'AddFormData',
};

export function addFormData(formId: string, formValues: any) {
    return actionCreator(actionTypes.ADD_FORM_DATA)(formValues, { formId });
}