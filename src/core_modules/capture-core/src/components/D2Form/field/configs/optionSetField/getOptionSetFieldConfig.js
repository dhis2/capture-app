// @flow
import { createFieldConfig, createProps } from '../configBase';
import { OptionSetSelectFieldForForm, OptionSetBoxesFieldForForm } from '../../Components';
import { inputTypes as optionSetInputTypes } from '../../../../../metaData/OptionSet/optionSet.const';

const getOptionSetFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        optionSet: metaData.optionSet,
        nullable: !metaData.compulsory,
        style: {
            width: options.formHorizontal ? 210 : '100%',
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
