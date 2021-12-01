// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { TextRangeFieldForForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';

export const getTextRangeFieldConfig = (metaData: MetaDataElement, options: Object, extraProps?: ?Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        multiLine: extraProps && extraProps.multiLine,
    }, options, metaData);

    return createFieldConfig({
        component: TextRangeFieldForForm,
        props,
    }, metaData);
};
