// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { OrgUnitFieldForCustomForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getOrgUnitField = (metaData: MetaDataElement) => {
  const props = createProps({}, metaData);

  return createFieldConfig(
    {
      component: OrgUnitFieldForCustomForm,
      props,
    },
    metaData,
  );
};

export default getOrgUnitField;
