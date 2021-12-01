// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { TextFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';

export const getTextFieldConfigForCustomForm = (metaData: MetaDataElement, extraProps?: ?Object) => {
    const props = createProps({
        multiLine: extraProps && extraProps.multiLine,
    }, metaData);

    return createFieldConfig({
        component: TextFieldForCustomForm,
        props,
    }, metaData);
};
