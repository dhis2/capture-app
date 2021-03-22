// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { OrgUnitFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

export const getOrgUnitFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
    }, metaData);

    return createFieldConfig({
        component: OrgUnitFieldForCustomForm,
        props,
    }, metaData);
};
