// @flow
import {
    withDefaultFieldContainer,
    withHideCompatibility,
    withLabel,
    withFilterProps,
    ViewModeField,
} from '../../../../FormFields/New';
import labelTypeClasses from '../../buildField.module.css';


const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const ViewModeFieldForForm =
withHideCompatibility()(
    withDefaultFieldContainer()(
        withLabel({
            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
            onGetCustomFieldLabeClass: (props: Object) =>
                `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.viewModeLabel}`,
        })(withFilterProps(getFilteredProps)(ViewModeField)),
    ),
);
