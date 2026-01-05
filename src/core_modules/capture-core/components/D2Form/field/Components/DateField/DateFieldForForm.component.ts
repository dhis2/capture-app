import { orientations } from 'capture-ui';
import {
    DateField,
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
    const orientation = formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL;
    return {
        orientation,
        ...passOnProps,
    };
};

export const DateFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withFocusSaver()(
                        withDefaultFieldContainer()(
                            withLabel({
                                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                                onGetCustomFieldLabeClass: (props: any) =>
                                    `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                            })(
                                withDisplayMessages()(
                                    withFilterProps(getFilteredProps)(
                                        withInternalChangeHandler()(DateField),
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
