import type { ComponentType } from 'react';
import {
    withGotoInterface,
    withHideCompatibility,
    withFocusSaver,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withFilterProps,
    withInternalChangeHandler,
} from '../../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
} from '../../internal';
import labelTypeClasses from '../../../buildField.module.css';

const getFilteredProps = (props: any) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const withDefaultFieldWrapperForForm = () =>
    (InnerComponent: ComponentType<any>) =>
        withGotoInterface()(
            withHideCompatibility()(
                withDisabledFieldCalculation()(
                    withRequiredFieldCalculation()(
                        withCalculateMessages()(
                            withFocusSaver()(
                                withDefaultFieldContainer()(
                                    withLabel({
                                        onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                                        onGetCustomFieldLabeClass: (props: any) =>
                                            `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                                    })(
                                        withDisplayMessages()(
                                            withFilterProps(getFilteredProps)(
                                                withInternalChangeHandler()(InnerComponent),
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
