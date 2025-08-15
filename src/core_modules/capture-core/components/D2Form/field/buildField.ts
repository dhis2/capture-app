
import { getDefaultFormField } from './defaultFormFieldGetter';
import { getCustomFormField } from './customFormFieldGetter';
import { type DataElement } from '../../../metaData';
import type { QuerySingleResource } from '../../../utils/api/api.types';

export function buildField(
    metaData: DataElement,
    options: any,
    useCustomFormFields: boolean,
    querySingleResource: QuerySingleResource,
) {
    return useCustomFormFields
        ? getCustomFormField(metaData, options, querySingleResource)
        : getDefaultFormField(metaData, options, querySingleResource);
}
