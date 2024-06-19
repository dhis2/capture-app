// @flow
import { loadNewDataEntry } from '../../../../../DataEntry/actions/dataEntryLoadNew.actions';
import { getEventDateValidatorContainers } from '../fieldValidators/eventDate.validatorContainersGetter';
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

export const getOpenDataEntryActions = (programCategory: ?ProgramCategory, selectedCategories: ?{ [key: string]: string }) => {
    let defaultDataEntryValues;
    if (programCategory && programCategory.categories) {
        dataEntryPropsToInclude.push(...programCategory.categories.map(category => ({
            id: `attributeCategoryOptions-${category.id}`,
            type: 'TEXT',
            validatorContainers: getCategoryOptionsValidatorContainers({ categories: programCategory.categories }, category.id),
        })));
    }

    if (selectedCategories) {
        defaultDataEntryValues = Object.keys(selectedCategories).reduce((accValues, key) => {
            accValues[`attributeCategoryOptions-${key}`] = selectedCategories[key];
            return accValues;
        }, {});
    }

    return [
        ...loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude, defaultDataEntryValues),
        addFormData(formId, {}),
    ];
};
