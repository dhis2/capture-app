// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { loadNewDataEntry } from '../../../../../DataEntry/actions/dataEntryLoadNew.actions';
import { getEventDateValidatorContainers, getOrgUnitValidatorContainers } from '../fieldValidators';
import { convertGeometryOut, convertStatusIn, convertStatusOut } from '../../../../index';
import { getNoteValidatorContainers } from '../fieldValidators/note.validatorContainersGetter';
import { dataEntryId, itemId, formId } from './constants';
import { addFormData } from '../../../../../D2Form/actions/form.actions';
import { getCategoryOptionsValidatorContainers } from '../../../../Enrollment/fieldValidators';
import type { ProgramCategory } from '../../../../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';

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

export const getOpenDataEntryActions = (
    programCategory: ?ProgramCategory,
    selectedCategories: ?{ [key: string]: string },
    orgUnit: ?{ ...OrgUnit, path: string },
) => {
    let defaultDataEntryValues = {
        orgUnit: orgUnit
            ? {
                id: orgUnit.id,
                name: orgUnit.name,
                path: orgUnit.path,
            }
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
