// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { UserNameFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getUserNameFieldConfig = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        usernameOnlyMode: true,
    }, options, metaData);

    return createFieldConfig({
        component: UserNameFieldForForm,
        props,
    }, metaData, querySingleResource);
};
