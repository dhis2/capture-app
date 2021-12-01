// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { orientations } from '../../../../FormFields/New';
import { ImageFieldForForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';

export const getImageFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        async: true,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
    }, options, metaData);

    return createFieldConfig({
        component: ImageFieldForForm,
        props,
    }, metaData);
};
