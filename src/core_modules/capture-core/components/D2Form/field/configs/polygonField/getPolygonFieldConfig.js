// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { PolygonFieldForForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getPolygonField = (metaData: MetaDataElement, options: Object) => {
  const props = createProps(
    {
      formHorizontal: options.formHorizontal,
      fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
      orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
      shrinkDisabled: options.formHorizontal,
      dialogLabel: metaData.formName,
    },
    options,
    metaData,
  );

  return createFieldConfig(
    {
      component: PolygonFieldForForm,
      props,
    },
    metaData,
  );
};

export default getPolygonField;
