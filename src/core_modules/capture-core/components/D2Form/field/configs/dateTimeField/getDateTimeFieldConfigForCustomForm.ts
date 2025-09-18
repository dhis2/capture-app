
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { DateTimeFieldForCustomForm } from '../../Components';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getDateTimeFieldConfigForCustomForm = (
    metaData: MetaDataElement, 
    options: any, 
    querySingleResource: QuerySingleResource
) => {
    const props = createProps({
        dateWidth: '100%',
        dateMaxWidth: '350px',
        calendarWidth: '350px',
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
        calendarType: systemSettingsStore.get().calendar,
        dateFormat: systemSettingsStore.get().dateFormat,
    }, metaData);

    return createFieldConfig({
        component: DateTimeFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};
