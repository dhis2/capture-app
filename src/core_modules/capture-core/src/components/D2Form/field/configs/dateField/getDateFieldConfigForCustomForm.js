// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { DateFieldForCustomForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getDateFieldConfig = (metaData: MetaDataElement) => {
    const props = createProps({
        width: 350,
        maxWidth: 350,
        calendarWidth: 350,
    }, metaData);

    return createFieldConfig({
        component: DateFieldForCustomForm,
        props,
    }, metaData);
};

export default getDateFieldConfig;
