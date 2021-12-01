// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { orientations } from '../../../../FormFields/New';
import { PolygonFieldForForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';

export const getPolygonFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
        dialogLabel: metaData.formName,
    }, options, metaData);

    return createFieldConfig({
        component: PolygonFieldForForm,
        props,
    }, metaData);
};
