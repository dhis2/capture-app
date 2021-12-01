// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { orientations } from '../../../../FormFields/New';
import { DateTimeFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';

export const getDateTimeFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
        dateWidth: '100%',
        dateMaxWidth: 350,
        calendarWidth: 350,
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
    }, metaData);

    return createFieldConfig({
        component: DateTimeFieldForCustomForm,
        props,
    }, metaData);
};
