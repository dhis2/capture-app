// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { UserNameFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

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
