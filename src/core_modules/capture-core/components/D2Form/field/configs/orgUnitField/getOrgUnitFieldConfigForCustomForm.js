// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { OrgUnitFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getOrgUnitFieldConfigForCustomForm = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
    }, metaData);

    return createFieldConfig({
        component: OrgUnitFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};
