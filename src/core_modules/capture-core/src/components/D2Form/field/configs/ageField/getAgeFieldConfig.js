// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { AgeFieldForForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

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
