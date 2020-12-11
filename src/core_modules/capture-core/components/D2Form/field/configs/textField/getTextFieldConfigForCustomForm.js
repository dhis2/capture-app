// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { TextFieldForCustomForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getTextFieldConfigForCustomForm = (metaData: MetaDataElement, extraProps?: ?Object) => {
  const props = createProps(
    {
      multiLine: extraProps && extraProps.multiLine,
    },
    metaData,
  );

  return createFieldConfig(
    {
      component: TextFieldForCustomForm,
      props,
    },
    metaData,
  );
};

export default getTextFieldConfigForCustomForm;
