// @flow

import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { getEventDateValidatorContainers, getOrgUnitValidatorContainers } from '../fieldValidators';
import { getNoteValidatorContainers } from '../fieldValidators/note.validatorContainersGetter';
import type { ProgramCategory } from '../../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';
import { getCategoryOptionsValidatorContainers } from '../fieldValidators/categoryOptions.validatorContainersGetter';

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'occurredAt',
        type: 'DATE',
        validatorContainers: getEventDateValidatorContainers(),
    },
    {
        id: 'orgUnit',
        type: 'ORGANISATION_UNIT',
        validatorContainers: getOrgUnitValidatorContainers(),
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
];

export const getOpenDataEntryActions =
    (dataEntryId: string, itemId: string, programCategory?: ProgramCategory, orgUnit: Object) => {
        const { id, name, path } = orgUnit;
        const defaultDataEntryValues = {
            orgUnit: { id, name, path },
        };
        if (programCategory && programCategory.categories) {
            dataEntryPropsToInclude.push(...programCategory.categories.map(category => ({
                id: `attributeCategoryOptions-${category.id}`,
                type: 'TEXT',
                validatorContainers: getCategoryOptionsValidatorContainers({ categories: programCategory.categories }, category.id),
            })));
        }
        return loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude, defaultDataEntryValues);
    };

