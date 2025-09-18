
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { DateTimeRangeFieldForForm } from '../../Components';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

const getCalendarAnchorPosition = (formHorizontal: boolean | null) => (formHorizontal ? 'center' : 'left');

export const getDateTimeRangeFieldConfig = (
    metaData: MetaDataElement,
    options: any,
    querySingleResource: QuerySingleResource
) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        dateWidth: options.formHorizontal ? 150 : '100%',
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
        calendarWidth: options.formHorizontal ? 250 : 350,
        popupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
        calendarType: systemSettingsStore.get().calendar,
        dateFormat: systemSettingsStore.get().dateFormat,
    }, options, metaData);

    return createFieldConfig({
        component: DateTimeRangeFieldForForm,
        props,
    }, metaData, querySingleResource);
};
