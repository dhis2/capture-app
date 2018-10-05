// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { TextFieldForCustomForm } from '../../Components';

const getTextFieldConfigForCustomForm = (metaData: MetaDataElement, extraProps?: ?Object) => {
    const props = createProps({
        multiLine: extraProps && extraProps.multiLine,
    }, metaData);

    return createFieldConfig({
        component: TextFieldForCustomForm,
        props,
    }, metaData);
};

export default getTextFieldConfigForCustomForm;
