// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { DateTimeFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

export const getDateTimeFieldConfig = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        dateWidth: options.formHorizontal ? 150 : '100%',
        dateMaxWidth: options.formHorizontal ? 150 : 350,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
        calendarWidth: options.formHorizontal ? 250 : 350,
        popupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
    }, options, metaData);

    return createFieldConfig({
        component: DateTimeFieldForForm,
        props,
    }, metaData, querySingleResource);
};
