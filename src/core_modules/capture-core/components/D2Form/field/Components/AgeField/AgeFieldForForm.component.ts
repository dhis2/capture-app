import {
    AgeField,
    withGotoInterface,
    withHideCompatibility,
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

const getFilteredProps = (props: any) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const AgeFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withFocusSaver()(
                        withDefaultFieldContainer()(
                            withLabel({
                                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                                onGetCustomFieldLabeClass: (props: any) =>
                                    `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.ageLabel}`,
                            })(
                                withDisplayMessages()(
                                    withFilterProps(getFilteredProps)(
                                        withInternalChangeHandler()(AgeField),
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
