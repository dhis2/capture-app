// @flow
import * as React from 'react';
import {
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
} from '../../../../../FormFields/New';
import withRequiredFieldCalculation from '../../../withRequiredFieldCalculation';
import labelTypeClasses from '../../../buildField.mod.css';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        withGotoInterface()(
            withHideCompatibility()(
                withDefaultShouldUpdateInterface()(
                    withRequiredFieldCalculation()(
                        withCalculateMessages()(
                            withFocusSaver()(
                                withDefaultFieldContainer()(
                                    withLabel({
                                        onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                                        onGetCustomFieldLabeClass: (props: Object) =>
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
