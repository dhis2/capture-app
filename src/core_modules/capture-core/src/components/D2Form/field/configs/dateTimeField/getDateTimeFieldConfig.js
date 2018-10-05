// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { DateTimeFieldForForm } from '../../Components';

const getDateTimeFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        dateWidth: options.formHorizontal ? 150 : '100%',
        dateMaxWidth: options.formHorizontal ? 150 : 350,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
        calendarWidth: 350,
    }, options, metaData);

    return createFieldConfig({
        component: DateTimeFieldForForm,
        props,
    }, metaData);
};

export default getDateTimeFieldConfig;
