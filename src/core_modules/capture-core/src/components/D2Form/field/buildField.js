// @flow
import getDefaultFormField from './defaultFormFieldGetter';
import getCustomFormField from './customFormFieldGetter';
import MetaDataElement from '../../../metaData/DataElement/DataElement';

export default function buildField(metaData: MetaDataElement, options: Object, useCustomFormFields: boolean): ?Field {
    return (useCustomFormFields ? getCustomFormField(metaData, options) : getDefaultFormField(metaData, options));
}
