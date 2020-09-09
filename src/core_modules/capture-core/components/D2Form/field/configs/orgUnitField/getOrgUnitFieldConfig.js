// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { OrgUnitFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

const getOrgUnitField = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formId: options.formId,
        elementId: metaData.id,
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        maxTreeHeight: 200,
    }, options, metaData);

    return createFieldConfig({
        component: OrgUnitFieldForForm,
        props,
    }, metaData);
};

export default getOrgUnitField;
