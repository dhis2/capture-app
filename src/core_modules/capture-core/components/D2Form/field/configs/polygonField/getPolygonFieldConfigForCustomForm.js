// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { PolygonFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

const getPolygonField = (metaData: MetaDataElement) => {
  const props = createProps(
    {
      orientation: orientations.HORIZONTAL,
      shrinkDisabled: false,
    },
    metaData,
  );

  return createFieldConfig(
    {
      component: PolygonFieldForCustomForm,
      props,
    },
    metaData,
  );
};

export default getPolygonField;
