// @flow
import type { FieldConfig } from 'capture-ui/FormBuilder/FormBuilder.component';
import { getBaseConfigForField } from './configBase';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { FieldConfigForType } from './configBase';

const getBaseProps = (metaData: MetaDataElement) => ({
    metaCompulsory: metaData.compulsory,
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
