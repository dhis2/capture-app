// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../configBase';
import { TrueOnlyFieldForForm } from '../../Components';

const getTrueOnlyField = (metaData: MetaDataElement, options: Object) => {
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

export default getTrueOnlyField;
