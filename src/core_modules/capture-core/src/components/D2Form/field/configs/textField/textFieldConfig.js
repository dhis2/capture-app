// @flow
import { createFieldConfig, createProps } from '../configBase';
import { TextFieldForForm } from '../../Components';

const getTextFieldConfig = (metaData: MetaDataElement, options: Object, extraProps?: ?Object) => {
    const props = createProps({
        label: metaData.formName,
        metaCompulsory: metaData.compulsory,
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        multiLine: extraProps && extraProps.multiLine,
    }, options);

    return createFieldConfig({
        component: TextFieldForForm,
        props,
    }, metaData);
};

export default getTextFieldConfig;
