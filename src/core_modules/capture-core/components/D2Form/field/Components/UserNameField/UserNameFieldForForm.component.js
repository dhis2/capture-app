// @flow
import { withTransformPropName } from '../../../../../HOC';
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
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
} from '../internal';
import labelTypeClasses from '../../buildField.module.css';
import { UserField } from '../../../../FormFields/UserField/UserField.component';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const UserNameFieldForForm = withGotoInterface()(
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
                                        `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                                })(
                                    withDisplayMessages()(
                                        withFilterProps(getFilteredProps)(
                                            withTransformPropName(['onBlur', 'onSet'])(
                                                withInternalChangeHandler()(UserField),
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
    ),
);
