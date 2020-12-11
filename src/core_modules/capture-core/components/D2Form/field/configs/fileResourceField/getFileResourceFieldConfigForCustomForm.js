// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { FileResourceFieldForCustomForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getFileResourceFieldConfig = (metaData: MetaDataElement) => {
  const props = createProps(
    {
      async: true,
      orientation: orientations.HORIZONTAL,
    },
    metaData,
  );

  return createFieldConfig(
    {
      component: FileResourceFieldForCustomForm,
      props,
    },
    metaData,
  );
};

export default getFileResourceFieldConfig;
