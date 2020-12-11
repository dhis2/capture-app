// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import {
  OptionSetSelectFieldForCustomForm,
  OptionSetBoxesFieldForCustomForm,
} from '../../Components';
import { getOptionsForRadioButtons, getOptionsForSelect } from './optionSetHelpers';
import { orientations } from '../../../../FormFields/New';
import { inputTypes } from '../../../../../metaData/OptionSet/optionSet.const';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const mapInputTypeToPropsGetterFn = {
  [inputTypes.DROPDOWN]: (metaData: MetaDataElement) => ({
    // $FlowFixMe[incompatible-call] automated comment
    options: getOptionsForSelect(metaData.optionSet),
    nullable: !metaData.compulsory,
  }),
  [inputTypes.HORIZONTAL_RADIOBUTTONS]: (metaData: MetaDataElement) => ({
    // $FlowFixMe[incompatible-call] automated comment
    options: getOptionsForRadioButtons(metaData.optionSet),
  }),
  [inputTypes.VERTICAL_RADIOBUTTONS]: (metaData: MetaDataElement) => ({
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

const getOptionSetFieldConfig = (metaData: MetaDataElement, options: Object) => {
  const { optionSet } = metaData;
  // $FlowFixMe[incompatible-use] automated comment
  const { inputType } = optionSet;
  const inputTypeProps = mapInputTypeToPropsGetterFn[inputType](metaData);

  const props = createProps(
    {
      id: metaData.id,
      formId: options.formId,
      // $FlowFixMe[incompatible-use] automated comment
      optionGroups: optionSet.optionGroups,
      ...inputTypeProps,
    },
    metaData,
  );

  return createFieldConfig(
    {
      component: mapInputTypeToComponent[inputType],
      props,
      commitEvent: inputType === inputTypes.DROPDOWN ? 'onBlur' : 'onSelect',
    },
    metaData,
  );
};

export default getOptionSetFieldConfig;
