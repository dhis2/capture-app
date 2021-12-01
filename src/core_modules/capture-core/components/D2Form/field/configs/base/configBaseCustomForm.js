// @flow
import type { FieldConfig } from 'capture-ui/FormBuilder/FormBuilder.component';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { getBaseConfigForField } from './configBase';
import type { FieldConfigForType } from './configBase';

const getBaseProps = ({ compulsory, disabled, unique }: MetaDataElement) => ({
    metaCompulsory: compulsory,
    metaDisabled: disabled || unique?.generatable,
});

export const createProps = (props?: ?Object, metaData: MetaDataElement) => ({
    ...getBaseProps(metaData),
    ...props,
});

// $FlowFixMe[prop-missing] automated comment
// $FlowFixMe[incompatible-return] automated comment
export const createFieldConfig = (fieldSpecifications: FieldConfigForType, metaData: MetaDataElement): FieldConfig => ({
    ...getBaseConfigForField(metaData),
    ...fieldSpecifications,
});
