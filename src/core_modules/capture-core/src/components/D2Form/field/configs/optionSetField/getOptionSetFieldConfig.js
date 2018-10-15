// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { OptionSetSelectFieldForForm, OptionSetBoxesFieldForForm } from '../../Components';
import { inputTypes as optionSetInputTypes } from '../../../../../metaData/OptionSet/optionSet.const';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getOptionSetFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        optionSet: metaData.optionSet,
        nullable: !metaData.compulsory,
        style: {
            width: '100%',
        },
    }, options, metaData);

    return createFieldConfig({
        component: (metaData.optionSet.inputType === optionSetInputTypes.SELECT
            ? OptionSetSelectFieldForForm
            : OptionSetBoxesFieldForForm),
        props,
    }, metaData);
};

export default getOptionSetFieldConfig;
