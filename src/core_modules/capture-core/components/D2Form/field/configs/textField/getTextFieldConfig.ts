import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { TextFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getTextFieldConfig = (
    metaData: MetaDataElement,
    options: any,
    querySingleResource: QuerySingleResource,
    extraProps?: any | null
) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        multiLine: extraProps && extraProps.multiLine,
    }, options, metaData);

    return createFieldConfig({
        component: TextFieldForForm,
        props,
    }, metaData, querySingleResource);
};
