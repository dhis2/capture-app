//
import moment from 'moment';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { DateFieldForCustomForm } from '../../Components';
import { convertDateanyToDateFormatString } from '../../../../../../capture-core/utils/converters/date';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';
import type { DateDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getDateFieldConfigForCustomForm = (metaData: DateDataElement, options: any, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        width: 350,
        maxWidth: 350,
        calendarWidth: 350,
        calendarMax: !metaData.allowFutureDate ? convertDateanyToDateFormatString(moment()) : undefined,
        calendarType: systemSettingsStore.get().calendar,
        dateFormat: systemSettingsStore.get().dateFormat,
    }, metaData);

    return createFieldConfig({
        component: DateFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};
