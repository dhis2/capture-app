// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { DateTimeRangeFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

const getCalendarAnchorPosition = (formHorizontal: ?boolean) =>
  formHorizontal ? 'center' : 'left';

const getDateTimeFieldConfig = (metaData: MetaDataElement, options: Object) => {
  const props = createProps(
    {
      formHorizontal: options.formHorizontal,
      fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
      dateWidth: options.formHorizontal ? 150 : '100%',
      dateMaxWidth: options.formHorizontal ? 150 : 350,
      orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
      shrinkDisabled: options.formHorizontal,
      calendarWidth: options.formHorizontal ? 250 : 350,
      popupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
    },
    options,
    metaData,
  );

  return createFieldConfig(
    {
      component: DateTimeRangeFieldForForm,
      props,
    },
    metaData,
  );
};

export default getDateTimeFieldConfig;
