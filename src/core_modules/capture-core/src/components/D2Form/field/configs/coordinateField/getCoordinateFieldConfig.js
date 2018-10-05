// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { CoordinateFieldForForm } from '../../Components';

const getCoordinateField = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
    }, options, metaData);

    return createFieldConfig({
        component: CoordinateFieldForForm,
        props,
    }, metaData);
};

export default getCoordinateField;
