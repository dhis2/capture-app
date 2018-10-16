// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { OrgUnitFieldForForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

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
