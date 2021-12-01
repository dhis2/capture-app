// @flow
import { type DataElement } from '../../../metaData';
import { getCustomFormField } from './customFormFieldGetter';
import { getDefaultFormField } from './defaultFormFieldGetter';

// $FlowFixMe[cannot-resolve-name] automated comment
export function buildField(metaData: DataElement, options: Object, useCustomFormFields: boolean): ?Field {
    return (useCustomFormFields ? getCustomFormField(metaData, options) : getDefaultFormField(metaData, options));
}
