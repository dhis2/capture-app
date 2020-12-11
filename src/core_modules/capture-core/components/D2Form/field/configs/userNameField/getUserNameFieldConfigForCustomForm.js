// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { UserNameFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

const getUsernameField = (metaData: MetaDataElement) => {
  const props = createProps({}, metaData);

  return createFieldConfig(
    {
      component: UserNameFieldForCustomForm,
      props,
    },
    metaData,
  );
};

export default getUsernameField;
