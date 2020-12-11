// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { BooleanFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

const getBooleanField = (metaData: MetaDataElement, options: Object) => {
  const props = createProps(
    {
      formHorizontal: options.formHorizontal,
      fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
      orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
      id: metaData.id,
    },
    options,
    metaData,
  );

  return createFieldConfig(
    {
      component: BooleanFieldForForm,
      props,
    },
    metaData,
  );
};

export default getBooleanField;
