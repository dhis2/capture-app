// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { OptionSetSelectFieldForCustomForm, OptionSetBoxesFieldForCustomForm } from '../../Components';
import { getOptions, getFormOptionSet } from './optionSetHelpers';
import { orientations } from '../../../../FormFields/New';
import { inputTypes } from '../../../../../metaData/OptionSet/optionSet.const';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';
import OptionSet from '../../../../../metaData/OptionSet/OptionSet';

const mapInputTypeToPropsGetterFn = {
    [inputTypes.DROPDOWN]: (metaData: MetaDataElement) => ({
        // $FlowSuppress
        optionSet: getFormOptionSet(metaData.optionSet),
        nullable: !metaData.compulsory,
    }),
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: (metaData: MetaDataElement) => ({
        // $FlowSuppress
        options: getOptions(metaData.optionSet),
        id: metaData.id,
    }),
    [inputTypes.VERTICAL_RADIOBUTTONS]: (metaData: MetaDataElement) => ({
        orientation: orientations.VERTICAL,
        // $FlowSuppress
        options: getOptions(metaData.optionSet),
        id: metaData.id,
    }),
};

const mapInputTypeToComponent = {
    [inputTypes.DROPDOWN]: OptionSetSelectFieldForCustomForm,
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: OptionSetBoxesFieldForCustomForm,
    [inputTypes.VERTICAL_RADIOBUTTONS]: OptionSetBoxesFieldForCustomForm,
};

const getOptionSetFieldConfig = (metaData: MetaDataElement) => {
    // $FlowSuppress
    const optionSet: OptionSet = metaData.optionSet;
    const inputType = optionSet.inputType;
    const inputTypeProps = mapInputTypeToPropsGetterFn[inputType](metaData);

    const props = createProps({
        ...inputTypeProps,
    }, metaData);

    return createFieldConfig({
        component: mapInputTypeToComponent[inputType],
        props,
        commitEvent: inputType === inputTypes.DROPDOWN ? 'onBlur' : 'onSelect',
    }, metaData);
};

export default getOptionSetFieldConfig;
