// @flow
import moment from 'moment';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { DateFieldForForm } from '../../Components';
import { convertDateObjectToDateFormatString } from '../../../../../../capture-core/utils/converters/date';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';
import type { DateDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

export const getDateFieldConfig = (metaData: DateDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        width: options.formHorizontal ? 150 : '100%',
        maxWidth: options.formHorizontal ? 150 : 350,
        calendarWidth: options.formHorizontal ? 250 : 350,
        popupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
        calendarMax: !metaData.allowFutureDate ? convertDateObjectToDateFormatString(moment()) : undefined,
        calendarType: systemSettingsStore.get().calendar,
        dateFormat: systemSettingsStore.get().dateFormat,
    }, options, metaData);

    return createFieldConfig({
        component: DateFieldForForm,
        props,
    }, metaData, querySingleResource);
};
