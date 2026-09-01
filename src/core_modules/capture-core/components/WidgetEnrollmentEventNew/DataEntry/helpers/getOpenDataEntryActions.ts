import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { getEventDateValidatorContainers, getOrgUnitValidatorContainers } from '../fieldValidators';
import { getNoteValidatorContainers } from '../fieldValidators/note.validatorContainersGetter';
import type { ProgramCategory } from '../../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';
import { getCategoryOptionsValidatorContainers } from '../fieldValidators/categoryOptions.validatorContainersGetter';
import type { DataEntryPropToInclude } from '../../../DataEntry/actions/dataEntryLoad.utils';
import { getTermLabel } from '../../../../metaData/helpers/customLabels';

const buildDataEntryPropsToInclude = (orgUnitLabel: string, eventLabel: string): Array<DataEntryPropToInclude> => [
    {
        id: 'occurredAt',
        type: 'DATE',
        validatorContainers: getEventDateValidatorContainers(),
    },
    {
        id: 'orgUnit',
        type: 'ORGANISATION_UNIT',
        validatorContainers: getOrgUnitValidatorContainers(orgUnitLabel),
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
        validatorContainers: getNoteValidatorContainers(eventLabel),
        clientIgnore: true,
    },
    {
        id: 'assignee',
        type: 'assignee',
    },
];

export const getOpenDataEntryActions =
    (
        dataEntryId: string,
        itemId: string,
        programId: string,
        programCategory?: ProgramCategory,
        orgUnit?: Record<string, unknown>,
    ) => {
        const defaultDataEntryValues = {
            orgUnit: orgUnit
                ? { id: orgUnit.id, name: orgUnit.name, path: orgUnit.path }
                : undefined,
        };
        const dataEntryPropsToInclude = buildDataEntryPropsToInclude(
            getTermLabel(programId, 'orgUnit'),
            getTermLabel(programId, 'event'),
        );
        if (programCategory && programCategory.categories) {
            dataEntryPropsToInclude.push(...programCategory.categories.map(category => ({
                id: `attributeCategoryOptions-${category.id}`,
                type: 'TEXT',
                validatorContainers: getCategoryOptionsValidatorContainers(
                    { categories: programCategory.categories },
                    category.id,
                ),
            })));
        }
        return loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude, defaultDataEntryValues);
    };
