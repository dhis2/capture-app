// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { DateTimeFieldForCustomForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getDateTimeFieldConfig = (metaData: MetaDataElement) => {
    const props = createProps({
        dateWidth: 350,
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

export default getDateTimeFieldConfig;
