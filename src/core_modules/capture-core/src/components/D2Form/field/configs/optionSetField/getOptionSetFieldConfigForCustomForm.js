// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { OptionSetSelectFieldForCustomForm, OptionSetBoxesFieldForCustomForm } from '../../Components';
import { inputTypes as optionSetInputTypes } from '../../../../../metaData/OptionSet/optionSet.const';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getOptionSetFieldConfig = (metaData: MetaDataElement) => {
    const props = createProps({
        optionSet: metaData.optionSet,
        nullable: !metaData.compulsory,
    }, metaData);

    return createFieldConfig({
        component: (metaData.optionSet.inputType === optionSetInputTypes.SELECT
            ? OptionSetSelectFieldForCustomForm
            : OptionSetBoxesFieldForCustomForm),
        props,
    }, metaData);
};

export default getOptionSetFieldConfig;
