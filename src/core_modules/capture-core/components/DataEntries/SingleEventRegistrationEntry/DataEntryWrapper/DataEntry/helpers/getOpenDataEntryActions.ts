import { CoreOrgUnit } from 'capture-core/metadataRetrieval/coreOrgUnit';
import { loadNewDataEntry } from '../../../../../DataEntry/actions/dataEntryLoadNew.actions';
import { getEventDateValidatorContainers, getOrgUnitValidatorContainers } from '../fieldValidators';
import { convertGeometryOut, convertStatusIn, convertStatusOut } from '../../../../index';
import { getNoteValidatorContainers } from '../fieldValidators/note.validatorContainersGetter';
import { dataEntryId, itemId, formId } from './constants';
import { addFormData } from '../../../../../D2Form/actions/form.actions';
import { getCategoryOptionsValidatorContainers } from '../../../../Enrollment/fieldValidators';
import type { ProgramCategory } from '../../../../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';
import type { DataEntryPropToInclude } from '../../../../../DataEntry/actions/dataEntryLoad.utils';

const dataEntryPropsToInclude: Array<DataEntryPropToInclude> = [
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
        type: 'assignee',
    },
];

export const getOpenDataEntryActions = (
    programCategory?: ProgramCategory | null,
    selectedCategories?: { [key: string]: string } | null,
    orgUnit?: CoreOrgUnit | null,
) => {
    let defaultDataEntryValues = {
        orgUnit: orgUnit
            ? { id: orgUnit.id, name: orgUnit.name, path: orgUnit.path }
            : undefined,
    };

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

    if (selectedCategories) {
        defaultDataEntryValues = Object.keys(selectedCategories).reduce((accValues, key) => {
            accValues[`attributeCategoryOptions-${key}`] = selectedCategories[key];
            return accValues;
        }, defaultDataEntryValues);
    }

    return [
        ...loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude, defaultDataEntryValues),
        addFormData(formId, {}),
    ];
};
