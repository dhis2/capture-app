// @flow
import moment from 'moment';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { DateFieldForCustomForm } from '../../Components';
import { convertDateObjectToDateFormatString } from '../../../../../../capture-core/utils/converters/date';
import type { DateDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getDateFieldConfigForCustomForm = (metaData: DateDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        width: 350,
        maxWidth: 350,
        calendarWidth: 350,
        calendarMax: !metaData.allowFutureDate ? convertDateObjectToDateFormatString(moment()) : undefined,
    }, metaData);

    return createFieldConfig({
        component: DateFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};
