// @flow
import type { DataElement, OptionSet } from '../../../../../metaData';
import { inputTypes } from '../../../../../metaData/OptionSet/optionSet.const';
import { orientations } from '../../../../FormFields/New';
import { OptionSetSelectFieldForCustomForm, OptionSetBoxesFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { getOptionsForRadioButtons, getOptionsForSelect } from './optionSetHelpers';

const mapInputTypeToPropsGetterFn = {
    [inputTypes.DROPDOWN]: (metaData: DataElement) => ({

        // $FlowFixMe[incompatible-call] automated comment
        options: getOptionsForSelect(metaData.optionSet),
        nullable: !metaData.compulsory,
    }),
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: (metaData: DataElement) => ({

        // $FlowFixMe[incompatible-call] automated comment
        options: getOptionsForRadioButtons(metaData.optionSet),
    }),
    [inputTypes.VERTICAL_RADIOBUTTONS]: (metaData: DataElement) => ({
        orientation: orientations.VERTICAL,

        // $FlowFixMe[incompatible-call] automated comment
        options: getOptionsForRadioButtons(metaData.optionSet),
    }),
};

const mapInputTypeToComponent = {
    [inputTypes.DROPDOWN]: OptionSetSelectFieldForCustomForm,
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: OptionSetBoxesFieldForCustomForm,
    [inputTypes.VERTICAL_RADIOBUTTONS]: OptionSetBoxesFieldForCustomForm,
};

export const getOptionSetFieldConfigForCustomForm = (metaData: DataElement, options: Object) => {
    // $FlowFixMe[incompatible-type] automated comment
    const optionSet: OptionSet = metaData.optionSet;
    const inputType = optionSet.inputType;
    const inputTypeProps = mapInputTypeToPropsGetterFn[inputType](metaData);

    const props = createProps({
        id: metaData.id,
        formId: options.formId,
        optionGroups: optionSet.optionGroups,
        ...inputTypeProps,
    }, metaData);

    return createFieldConfig({
        component: mapInputTypeToComponent[inputType],
        props,
        commitEvent: inputType === inputTypes.DROPDOWN ? 'onBlur' : 'onSelect',
    }, metaData);
};
