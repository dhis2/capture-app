// @flow
import getDefaultFormField from './defaultFormFieldGetter';
import getCustomFormField from './customFormFieldGetter';
import { DataElement as MetaDataElement } from '../../../metaData';

// $FlowFixMe[cannot-resolve-name] automated comment
export default function buildField(metaData: MetaDataElement, options: Object, useCustomFormFields: boolean): ?Field {
    return (useCustomFormFields ? getCustomFormField(metaData, options) : getDefaultFormField(metaData, options));
}
