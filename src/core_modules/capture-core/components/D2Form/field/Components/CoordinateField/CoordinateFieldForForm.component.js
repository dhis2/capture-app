// @flow
import {
    CoordinateField,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withFilterProps,
    withInternalChangeHandler,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
} from '../internal';
import labelTypeClasses from '../../buildField.module.css';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const CoordinateFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withCalculateMessages()(
                        withFocusSaver()(
                            withDefaultFieldContainer()(
                                withLabel({
                                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                                    onGetCustomFieldLabeClass: (props: Object) =>
                                        `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
                                })(
                                    withDisplayMessages()(
                                        withFilterProps(getFilteredProps)(
                                            withInternalChangeHandler()(CoordinateField),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
