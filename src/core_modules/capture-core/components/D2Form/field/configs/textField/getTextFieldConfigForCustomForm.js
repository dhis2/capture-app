// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { TextFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getTextFieldConfigForCustomForm = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource, extraProps?: ?Object) => {
    const props = createProps({
        multiLine: extraProps && extraProps.multiLine,
    }, metaData);

    return createFieldConfig({
        component: TextFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};
