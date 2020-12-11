// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { CoordinateFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

const getCoordinateField = (metaData: MetaDataElement) => {
  const props = createProps(
    {
      orientation: orientations.HORIZONTAL,
      shrinkDisabled: false,
    },
    metaData,
  );

  return createFieldConfig(
    {
      component: CoordinateFieldForCustomForm,
      props,
    },
    metaData,
  );
};

export default getCoordinateField;
