// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { OptionSetSelectFieldForForm, OptionSetBoxesFieldForForm } from '../../Components';
import { getOptionsForRadioButtons, getOptionsForSelect } from './optionSetHelpers';
import { orientations } from '../../../../FormFields/New';
import { inputTypes } from '../../../../../metaData/OptionSet/optionSet.const';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';
import OptionSet from '../../../../../metaData/OptionSet/OptionSet';

const mapInputTypeToPropsGetterFn = {
    [inputTypes.DROPDOWN]: (metaData: MetaDataElement) => ({
        // $FlowSuppress
        options: getOptionsForSelect(metaData.optionSet),
        nullable: !metaData.compulsory,
        style: {
            width: '100%',
        },
    }),
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: (metaData: MetaDataElement) => ({
        // $FlowSuppress
        options: getOptionsForRadioButtons(metaData.optionSet),
    }),
    [inputTypes.VERTICAL_RADIOBUTTONS]: (metaData: MetaDataElement) => ({
        orientation: orientations.VERTICAL,
        // $FlowSuppress
        options: getOptionsForRadioButtons(metaData.optionSet),
    }),
};

const mapInputTypeToComponent = {
    [inputTypes.DROPDOWN]: OptionSetSelectFieldForForm,
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: OptionSetBoxesFieldForForm,
    [inputTypes.VERTICAL_RADIOBUTTONS]: OptionSetBoxesFieldForForm,
};


const getOptionSetFieldConfig = (metaData: MetaDataElement, options: Object) => {
    // $FlowSuppress
    const optionSet: OptionSet = metaData.optionSet;
    const inputType = optionSet.inputType;
    const inputTypeProps = mapInputTypeToPropsGetterFn[inputType](metaData);

    const props = createProps({
        id: metaData.id,
        formId: options.formId,
        formHorizontal: options.formHorizontal,
        optionGroups: optionSet.optionGroups,
        ...inputTypeProps,
    }, options, metaData);

    return createFieldConfig({
        component: mapInputTypeToComponent[inputType],
        props,
        commitEvent: inputType === inputTypes.DROPDOWN ? 'onBlur' : 'onSelect',
    }, metaData);
};

export default getOptionSetFieldConfig;
