// @flow
import {
    withDefaultFieldContainer,
    withLabel,
    withFilterProps,
    ViewModeField,
} from '../../../../FormFields/New';
import labelTypeClasses from '../../buildField.mod.css';


const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export default
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
