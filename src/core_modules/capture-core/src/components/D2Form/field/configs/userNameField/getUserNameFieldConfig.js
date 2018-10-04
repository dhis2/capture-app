// @flow
import { createFieldConfig, createProps } from '../configBase';
import { UserNameFieldForForm } from '../../Components';

const getUsernameField = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
    }, options, metaData);

    return createFieldConfig({
        component: UserNameFieldForForm,
        props,
    }, metaData);
};

export default getUsernameField;
