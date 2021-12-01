// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { AgeFieldForForm } from '../../Components';
import { orientations } from '../../../../FormFields/New';
import { type DataElement } from '../../../../../metaData';

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

export const getAgeFieldConfig = (metaData: DataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
        dateCalendarWidth: options.formHorizontal ? 250 : 350,
        datePopupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
    }, options, metaData);

    return createFieldConfig({
        component: AgeFieldForForm,
        props,
    }, metaData);
};
