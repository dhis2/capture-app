// @flow
import moment from 'moment';
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { AgeFieldForForm } from '../../Components';
import { convertDateObjectToDateFormatString } from '../../../../../../capture-core/utils/converters/date';
import { type DateDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

export const getAgeFieldConfig = (metaData: DateDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
        dateCalendarWidth: options.formHorizontal ? 250 : 350,
        datePopupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
        calendarMax: !metaData.allowFutureDate ? convertDateObjectToDateFormatString(moment()) : undefined,
    }, options, metaData);

    return createFieldConfig({
        component: AgeFieldForForm,
        props,
    }, metaData, querySingleResource);
};
