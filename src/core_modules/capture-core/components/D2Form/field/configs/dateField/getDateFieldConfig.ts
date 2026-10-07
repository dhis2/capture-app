
import moment from 'moment';
import { convertDateObjectToDateFormatString } from 'capture-core/utils/converters/date';
import { isLangRtl } from '../../../../../utils/rtl';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { DateFieldForForm } from '../../Components';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';
import type { DateDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

const getCalendarAnchorPosition = (formHorizontal: boolean | null) => {
    if (formHorizontal) {
        return 'center';
    }
    return isLangRtl() ? 'right' : 'left';
};

export const getDateFieldConfig = (metaData: DateDataElement, options: any, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        width: '100%',
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
