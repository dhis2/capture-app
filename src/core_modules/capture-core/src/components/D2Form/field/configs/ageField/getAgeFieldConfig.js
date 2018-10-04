// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../configBase';
import { AgeFieldForForm } from '../../Components';

const getAgeField = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
    }, options, metaData);

    return createFieldConfig({
        component: AgeFieldForForm,
        props,
    }, metaData);
};

export default getAgeField;
