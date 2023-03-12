// @flow
import { convertValue } from '../../../converters/formToClient';
import { convertDataEntryValuesToClientValues } from './convertDataEntryValuesToClientValues';
import type { RenderFoundation } from '../../../metaData';

export const deriveFormValuesAndCategoryValues = (formValues: Object, categoryCombinationForm?: ?RenderFoundation) => {
    if (!categoryCombinationForm) { return { formValues, categoryValues: undefined }; }
    const attributeCategoryOptionIds = [...categoryCombinationForm.sections.get(categoryCombinationForm.id).elements.keys()];
    const categoryValues = {};

    Object.keys(formValues).forEach((dataElementId) => {
        if (attributeCategoryOptionIds.includes(dataElementId)) {
            categoryValues[dataElementId] = formValues[dataElementId];
            delete formValues[dataElementId];
        }
    });
    return { formValues, categoryValues };
};
export function convertDataEntryToClientValues(
    formFoundation: RenderFoundation,
    formValues: Object,
    dataEntryValues: Object,
    dataEntryValuesMeta: Object,
    categoryCombinationForm?: ?RenderFoundation,
) {
    const { formValues: values, categoryValues } = deriveFormValuesAndCategoryValues(formValues, categoryCombinationForm);

    const formClientValues = formFoundation.convertValues(values, convertValue);
    const dataEntryClientValues = convertDataEntryValuesToClientValues(
        dataEntryValues,
        dataEntryValuesMeta,
        formFoundation,
    );

    return {
        formClientValues,
        dataEntryClientValues,
        categoryValues,
    };
}
