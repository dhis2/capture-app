// @flow
import { loadNewDataEntry } from '../../../../../DataEntry/actions/dataEntryLoadNew.actions';
import { getEventDateValidatorContainers } from '../fieldValidators/eventDate.validatorContainersGetter';
import { convertGeometryOut, convertStatusIn, convertStatusOut } from '../../../../index';
import { getNoteValidatorContainers } from '../fieldValidators/note.validatorContainersGetter';
import { dataEntryId, itemId, formId } from './constants';
import { addFormData } from '../../../../../D2Form/actions/form.actions';

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'occurredAt',
        type: 'DATE',
        validatorContainers: getEventDateValidatorContainers(),
    },
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
    {
        id: 'note',
        type: 'TEXT',
        validatorContainers: getNoteValidatorContainers(),
        clientIgnore: true,
    },
    {
        id: 'relationship',
        type: 'TEXT',
        clientIgnore: true,
    },
    {
        clientId: 'status',
        dataEntryId: 'complete',
        onConvertIn: convertStatusIn,
        onConvertOut: convertStatusOut,
    },
    {
        id: 'assignee',
    },
];

export const getOpenDataEntryActions = () => [
    ...loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude),
    addFormData(formId, {}),
];
