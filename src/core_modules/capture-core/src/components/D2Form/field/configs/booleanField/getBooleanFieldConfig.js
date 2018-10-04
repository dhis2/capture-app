// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../configBase';
import { BooleanFieldForForm } from '../../Components';

const getBooleanField = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        id: metaData.id,
    }, options, metaData);

    return createFieldConfig({
        component: BooleanFieldForForm,
        props,
    }, metaData);
};

export default getBooleanField;
