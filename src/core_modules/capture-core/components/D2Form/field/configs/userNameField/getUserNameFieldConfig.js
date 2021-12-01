// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { UserNameFieldForForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';

export const getUserNameFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        usernameOnlyMode: true,
    }, options, metaData);

    return createFieldConfig({
        component: UserNameFieldForForm,
        props,
    }, metaData);
};
