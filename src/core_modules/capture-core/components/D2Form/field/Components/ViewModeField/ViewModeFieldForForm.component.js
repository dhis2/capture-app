// @flow
import labelTypeClasses from '../../buildField.module.css';
import {
    withDefaultFieldContainer,
    withLabel,
    withFilterProps,
    ViewModeField,
} from '../../../../FormFields/New';


const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const ViewModeFieldForForm =
withDefaultFieldContainer()(
    withLabel({
        onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
        onGetCustomFieldLabeClass: (props: Object) =>
            `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.viewModeLabel}`,
    })(
        withFilterProps(getFilteredProps)(
            ViewModeField,
        ),
    ),
);
