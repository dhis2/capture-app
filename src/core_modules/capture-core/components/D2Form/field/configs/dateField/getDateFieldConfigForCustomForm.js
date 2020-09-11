// @flow
import { moment } from 'capture-core-utils/moment';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { DateFieldForCustomForm } from '../../Components';
import type { DateDataElement } from '../../../../../metaData';

const getDateFieldConfig = (metaData: DateDataElement) => {
    const props = createProps({
        width: 350,
        maxWidth: 350,
        calendarWidth: 350,
        calendarMaxMoment: !metaData.allowFutureDate ? moment() : undefined,
    }, metaData);

    return createFieldConfig({
        component: DateFieldForCustomForm,
        props,
    }, metaData);
};

export default getDateFieldConfig;
