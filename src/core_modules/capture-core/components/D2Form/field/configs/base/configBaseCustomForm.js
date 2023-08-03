// @flow
import type { FieldConfig } from '../../../FormBuilder';
import { getBaseConfigForField } from './configBase';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { FieldConfigForType } from './configBase';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

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
export const createFieldConfig = (fieldSpecifications: FieldConfigForType, metaData: MetaDataElement, querySingleResource: QuerySingleResource): FieldConfig => ({
    ...getBaseConfigForField(metaData, querySingleResource),
    ...fieldSpecifications,
});
