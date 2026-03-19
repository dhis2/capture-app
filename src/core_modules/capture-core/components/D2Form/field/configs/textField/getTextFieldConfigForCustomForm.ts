import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { TextFieldForCustomForm } from '../../Components';
import { dataElementTypes } from '../../../../../metaData';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

// Input fields that should always be left-to-right (LTR)
const isLtrInputType = (type: keyof typeof dataElementTypes): boolean =>
    type === dataElementTypes.URL || type === dataElementTypes.EMAIL || type === dataElementTypes.PHONE_NUMBER;

export const getTextFieldConfigForCustomForm = (
    metaData: MetaDataElement,
    options: any,
    querySingleResource: QuerySingleResource,
    extraProps?: any | null,
) => {
    const props = createProps({
        multiLine: extraProps && extraProps.multiLine,
        ...(isLtrInputType(metaData.type) ? { dir: 'ltr' as const } : {}),
    }, metaData);

    return createFieldConfig({
        component: TextFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};
