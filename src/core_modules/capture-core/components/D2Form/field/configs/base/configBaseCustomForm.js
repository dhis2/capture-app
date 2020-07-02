// @flow
import type { FieldConfig } from 'capture-ui/FormBuilder/FormBuilder.component';
import { getBaseConfigForField } from './configBase';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';
import type { FieldConfigForType } from './configBase';

const getBaseProps = (metaData: MetaDataElement) => ({
    metaCompulsory: metaData.compulsory,
});

export const createProps = (props?: ?Object, metaData: MetaDataElement) => ({
    ...getBaseProps(metaData),
    ...props,
});

export const createFieldConfig = (fieldSpecifications: FieldConfigForType, metaData: MetaDataElement): FieldConfig => ({
    ...getBaseConfigForField(metaData),
    ...fieldSpecifications,
});
