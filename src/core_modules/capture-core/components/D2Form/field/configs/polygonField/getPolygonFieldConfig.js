// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { PolygonFieldForForm } from '../../Components';
import { orientations } from '../../../../FormFields/New';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

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
