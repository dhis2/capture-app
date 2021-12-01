// @flow
import moment from 'moment';
import type { DateDataElement } from '../../../../../metaData';
import { DateFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';

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
