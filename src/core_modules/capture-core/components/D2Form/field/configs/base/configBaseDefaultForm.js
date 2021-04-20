// @flow
import type { FieldConfig } from 'capture-ui/FormBuilder/FormBuilder.component';

import { convertPx, getBaseConfigForField } from './configBase';
import type { DataElement } from '../../../../../metaData';
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

const getBaseProps = ({ formName, compulsory, disabled, unique, icon }: DataElement) => ({
    styles: baseComponentStyles,
    label: formName,
    metaCompulsory: compulsory,
    metaDisabled: disabled || (unique && unique.generatable),
    icon: icon ? {
        name: icon.name,
        color: icon.color,
    } : null,
});

const getBaseFormHorizontalProps = (options: Object) => ({
    style: {
        width: convertPx(options, 150),
    },
    styles: baseComponentStylesVertical,
});

export const createProps = (props?: ?Object, options: Object, metaData: DataElement) => ({
    ...getBaseProps(metaData),
    ...(options && options.formHorizontal ? getBaseFormHorizontalProps(options) : {}),
    ...props,
});

// $FlowFixMe[prop-missing] automated comment
// $FlowFixMe[incompatible-return] automated comment
export const createFieldConfig = (fieldSpecifications: FieldConfigForType, metaData: DataElement): FieldConfig => ({
    ...getBaseConfigForField(metaData),
    ...fieldSpecifications,
});
