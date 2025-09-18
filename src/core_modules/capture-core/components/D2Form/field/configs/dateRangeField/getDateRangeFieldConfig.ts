
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { DateRangeFieldForForm } from '../../Components';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

const getCalendarAnchorPosition = (formHorizontal: boolean | null) => (formHorizontal ? 'center' : 'left');

export const getDateRangeFieldConfig = (
    metaData: MetaDataElement,
    options: any,
    querySingleResource: QuerySingleResource
) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        dateWidth: options.formHorizontal ? '150px' : '100%',
        dateMaxWidth: options.formHorizontal ? '150px' : '350px',
        calendarWidth: options.formHorizontal ? '250px' : '350px',
        popupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
        calendarType: systemSettingsStore.get().calendar,
        dateFormat: systemSettingsStore.get().dateFormat,
    }, options, metaData);

    return createFieldConfig({
        component: DateRangeFieldForForm,
        props,
    }, metaData, querySingleResource);
};
