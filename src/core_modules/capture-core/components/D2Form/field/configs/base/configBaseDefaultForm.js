// @flow
import type { FieldConfig } from '../../../FormBuilder.component';
import { convertPx, getBaseConfigForField } from './configBase';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';
import type { FieldConfigForType } from './configBase';

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

const baseComponentStylesVertical = {
    labelContainerStyle: {
        width: 150,
    },
    inputContainerStyle: {
        width: 150,
    },
};

const getBaseProps = (metaData: MetaDataElement) => ({
    styles: baseComponentStyles,
    label: metaData.formName,
    metaCompulsory: metaData.compulsory,
    metaDisabled: metaData.disabled || (metaData.unique && metaData.unique.generatable),
    icon: metaData.icon ? {
        data: metaData.icon.data,
        color: metaData.icon.color,
    } : null,
});

const getBaseFormHorizontalProps = (options: Object) => ({
    style: {
        width: convertPx(options, 150),
    },
    styles: baseComponentStylesVertical,
});

export const createProps = (props?: ?Object, options: Object, metaData: MetaDataElement) => ({
    ...getBaseProps(metaData),
    ...(options && options.formHorizontal ? getBaseFormHorizontalProps(options) : {}),
    ...props,
});

// $FlowFixMe[prop-missing] automated comment
// $FlowFixMe[incompatible-return] automated comment
export const createFieldConfig = (fieldSpecifications: FieldConfigForType, metaData: MetaDataElement): FieldConfig => ({
    ...getBaseConfigForField(metaData),
    ...fieldSpecifications,
});
