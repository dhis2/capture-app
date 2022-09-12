// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { BooleanFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getBooleanFieldConfig = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        id: metaData.id,
    }, options, metaData);

    return createFieldConfig({
        component: BooleanFieldForForm,
        props,
    }, metaData, querySingleResource);
};
