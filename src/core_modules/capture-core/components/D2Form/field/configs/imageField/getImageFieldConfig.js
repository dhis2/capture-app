// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { ImageFieldForForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getImageFieldConfig = (metaData: MetaDataElement, options: Object) => {
  const props = createProps(
    {
      formHorizontal: options.formHorizontal,
      fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
      async: true,
      orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
    },
    options,
    metaData,
  );

  return createFieldConfig(
    {
      component: ImageFieldForForm,
      props,
    },
    metaData,
  );
};

export default getImageFieldConfig;
