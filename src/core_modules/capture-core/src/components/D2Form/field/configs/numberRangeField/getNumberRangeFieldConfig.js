// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { NumberRangeFieldForForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getNumberFieldConfig = (metaData: MetaDataElement, options: Object, extraProps?: ?Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        multiLine: extraProps && extraProps.multiLine,
    }, options, metaData);

    return createFieldConfig({
        component: NumberRangeFieldForForm,
        props,
    }, metaData);
};

export default getNumberFieldConfig;
