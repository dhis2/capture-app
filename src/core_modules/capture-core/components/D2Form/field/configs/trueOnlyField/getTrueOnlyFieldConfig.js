// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { orientations } from '../../../../FormFields/New';
import { TrueOnlyFieldForForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';

export const getTrueOnlyFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        id: metaData.id,
    }, options, metaData);

    return createFieldConfig({
        component: TrueOnlyFieldForForm,
        props,
    }, metaData);
};
