import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { TextFieldForForm } from '../../Components';
import { dataElementTypes } from '../../../../../metaData';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

// Input fields that should always be left-to-right (LTR)
const isLtrInputType = (type: keyof typeof dataElementTypes): boolean =>
    type === dataElementTypes.URL || type === dataElementTypes.EMAIL || type === dataElementTypes.PHONE_NUMBER;

export const getTextFieldConfig = (
    metaData: MetaDataElement,
    options: any,
    querySingleResource: QuerySingleResource,
    extraProps?: any | null,
) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        multiLine: extraProps && extraProps.multiLine,
        showHelpText: options.showHelpText,
        ...(isLtrInputType(metaData.type) ? { dir: 'ltr' as const } : {}),
    }, options, metaData);

    return createFieldConfig({
        component: TextFieldForForm,
        props,
    }, metaData, querySingleResource);
};
