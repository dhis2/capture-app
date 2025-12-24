import {
    VirtualizedSelectField,
    withSelectTranslations,
    withGotoInterface,
    withHideCompatibility,
    withFocusSaver,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withFilterProps,
    withOptionsIconElement,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
    withRulesOptionVisibilityHandler,
} from '../internal';
import labelTypeClasses from '../../buildField.module.css';

const getFilteredProps = (props: any) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const OptionSetSelectFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withFocusSaver()(
                    withCalculateMessages()(
                        withDefaultFieldContainer()(
                            withLabel({
                                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                                onGetCustomFieldLabeClass: (props: any) =>
                                    `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                            })(
                                withDisplayMessages()(
                                    withOptionsIconElement()(
                                        withRulesOptionVisibilityHandler()(
                                            withFilterProps(getFilteredProps)(
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
    ),
);
