// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { OrgUnitFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';

export const getOrgUnitFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
    }, metaData);

    return createFieldConfig({
        component: OrgUnitFieldForCustomForm,
        props,
    }, metaData);
};
