// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { OrgUnitFieldForForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';

export const getOrgUnitFieldConfig = (metaData: MetaDataElement, options: Object) => {
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
