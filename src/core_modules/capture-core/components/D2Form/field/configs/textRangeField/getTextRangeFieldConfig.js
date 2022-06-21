// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { TextRangeFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getTextRangeFieldConfig = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
    }, options, metaData);

    return createFieldConfig({
        component: TextRangeFieldForForm,
        props,
    }, metaData, querySingleResource);
};
