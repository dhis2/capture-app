// @flow
import { createFieldConfig, createProps } from '../configBase';
import { OrgUnitFieldForForm } from '../../Components';

const getOrgUnitField = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
    }, options, metaData);

    return createFieldConfig({
        component: OrgUnitFieldForForm,
        props,
    }, metaData);
};

export default getOrgUnitField;
