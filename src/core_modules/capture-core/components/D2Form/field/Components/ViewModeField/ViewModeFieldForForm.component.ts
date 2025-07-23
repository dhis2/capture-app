import {
    withDefaultFieldContainer,
    withHideCompatibility,
    withLabel,
    withFilterProps,
    ViewModeField,
} from '../../../../FormFields/New';
import labelTypeClasses from '../../buildField.module.css';


const getFilteredProps = (props: any) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const ViewModeFieldForForm =
withHideCompatibility()(
    withDefaultFieldContainer()(
        withLabel({
            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
            onGetCustomFieldLabeClass: (props: any) =>
                `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.viewModeLabel}`,
        })(withFilterProps(getFilteredProps)(ViewModeField)),
    ),
);
