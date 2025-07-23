//
import moment from 'moment';
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { AgeFieldForForm } from '../../Components';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';
import { convertDateObjectToDateFormatString } from '../../../../../../capture-core/utils/converters/date';
import { type DateDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

const getCalendarAnchorPosition = (formHorizontal: boolean | null) => (formHorizontal ? 'center' : 'left');

export const getAgeFieldConfig = (metaData: DateDataElement, options: any, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
        dateCalendarWidth: options.formHorizontal ? 250 : 350,
        datePopupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
        calendarType: systemSettingsStore.get().calendar,
        dateFormat: systemSettingsStore.get().dateFormat,
        calendarMax: !metaData.allowFutureDate ? convertDateObjectToDateFormatString(moment()) : undefined,
    }, options, metaData);

    return createFieldConfig({
        component: AgeFieldForForm,
        props,
    }, metaData, querySingleResource);
};
