// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { TextFieldForForm } from '../../Components';

const getTextFieldConfig = (metaData: MetaDataElement, options: Object, extraProps?: ?Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        multiLine: extraProps && extraProps.multiLine,
    }, options, metaData);

    return createFieldConfig({
        component: TextFieldForForm,
        props,
    }, metaData);
};

export default getTextFieldConfig;
