// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { UserNameFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getUserNameFieldConfigForCustomForm = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
    }, metaData);

    return createFieldConfig({
        component: UserNameFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};
