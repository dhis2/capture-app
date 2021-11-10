// @flow
import moment from 'moment';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { DateFieldForCustomForm } from '../../Components';
import type { DateDataElement } from '../../../../../metaData';

export const getDateFieldConfigForCustomForm = (metaData: DateDataElement) => {
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
