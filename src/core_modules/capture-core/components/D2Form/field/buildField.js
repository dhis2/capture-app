// @flow
import getDefaultFormField from './defaultFormFieldGetter';
import getCustomFormField from './customFormFieldGetter';
import MetaDataElement from '../../../metaData/DataElement/DataElement';

// $FlowFixMe[cannot-resolve-name] automated comment
export default function buildField(metaData: MetaDataElement, options: Object, useCustomFormFields: boolean): ?Field {
    return (useCustomFormFields ? getCustomFormField(metaData, options) : getDefaultFormField(metaData, options));
}
