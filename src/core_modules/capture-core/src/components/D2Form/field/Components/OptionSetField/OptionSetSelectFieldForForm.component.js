// @flow
import {
    VirtualizedSelectField,
    withConvertedOptionSet,
    withSelectTranslations,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withFilterProps,
} from '../../../../FormFields/New';
import withRequiredFieldCalculation from '../../withRequiredFieldCalculation';
import labelTypeClasses from '../../buildField.mod.css';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withRequiredFieldCalculation()(
                withFocusSaver()(
                    withCalculateMessages()(
                        withDefaultFieldContainer()(
                            withLabel({
                                onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                                onGetCustomFieldLabeClass: (props: Object) =>
                                    `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                            })(
                                withDisplayMessages()(
                                    withFilterProps(getFilteredProps)(
                                        withConvertedOptionSet()(
                                            withSelectTranslations()(VirtualizedSelectField),
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
