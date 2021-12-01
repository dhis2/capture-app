// @flow
import { type DataElement } from '../../../metaData';
import { getDefaultFormField } from './defaultFormFieldGetter';
import { getCustomFormField } from './customFormFieldGetter';

// $FlowFixMe[cannot-resolve-name] automated comment
export function buildField(metaData: DataElement, options: Object, useCustomFormFields: boolean): ?Field {
    return (useCustomFormFields ? getCustomFormField(metaData, options) : getDefaultFormField(metaData, options));
}
