// @flow
import getDefaultFormField from './defaultFormFieldGetter';
import getCustomFormField from './customFormFieldGetter';
import { type DataElement } from '../../../metaData';

export default function buildField(
  metaData: DataElement,
  options: Object,
  useCustomFormFields: boolean,
// $FlowFixMe[cannot-resolve-name] automated comment
): ?Field {
  return useCustomFormFields
    ? getCustomFormField(metaData, options)
    : getDefaultFormField(metaData, options);
}
