// @flow
import getDefaultFormField from './defaultFormFieldGetter';
import getCustomFormField from './customFormFieldGetter';
import { type DataElement } from '../../../metaData';

// $FlowFixMe[cannot-resolve-name] automated comment
export default function buildField(metaData: DataElement, options: Object, useCustomFormFields: boolean): ?Field {
    return (useCustomFormFields ? getCustomFormField(metaData, options) : getDefaultFormField(metaData, options));
}
