// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { DateRangeFieldForForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

const getDateFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        width: options.formHorizontal ? 150 : '100%',
        maxWidth: options.formHorizontal ? 150 : 350,
        calendarWidth: options.formHorizontal ? 250 : 350,
        popupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
    }, options, metaData);

    return createFieldConfig({
        component: DateRangeFieldForForm,
        props,
    }, metaData);
};

export default getDateFieldConfig;
