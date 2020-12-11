// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { DateTimeFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

const getDateTimeFieldConfig = (metaData: MetaDataElement) => {
  const props = createProps(
    {
      dateWidth: '100%',
      dateMaxWidth: 350,
      calendarWidth: 350,
      orientation: orientations.HORIZONTAL,
      shrinkDisabled: false,
    },
    metaData,
  );

  return createFieldConfig(
    {
      component: DateTimeFieldForCustomForm,
      props,
    },
    metaData,
  );
};

export default getDateTimeFieldConfig;
