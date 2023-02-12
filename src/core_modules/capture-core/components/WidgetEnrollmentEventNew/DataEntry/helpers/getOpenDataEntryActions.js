// @flow

import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { getEventDateValidatorContainers } from '../fieldValidators/eventDate.validatorContainersGetter';
import { getNoteValidatorContainers } from '../fieldValidators/note.validatorContainersGetter';
import { getCategoryOptionsValidatorContainers } from '../fieldValidators/categoryOptions.validatorContainersGetter';

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'occurredAt',
        type: 'DATE',
        validatorContainers: getEventDateValidatorContainers(),
    },
    {
        id: 'scheduledAt',
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
        id: 'assignee',
    },
    {
        id: 'attributeCategoryOptions',
        type: 'TEXT',
        validatorContainers: getCategoryOptionsValidatorContainers(),
    },
];

export const getOpenDataEntryActions =
    (dataEntryId: string, itemId: string) =>
        loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);
