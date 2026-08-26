import {
    SelectionBoxes,
    withGotoInterface,
    withHideCompatibility,
    withFocusSaver,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withFilterProps,
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

export const OptionSetBoxesFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withFocusSaver()(
                    withCalculateMessages()(
                        withDefaultFieldContainer()(
                            withLabel({
                                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                                onGetCustomFieldLabeClass: (props: any) =>
                                    `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.optionSetBoxesLabel}`,
                            })(
                                withDisplayMessages()(
                                    withFilterProps(getFilteredProps)(
                                        withRulesOptionVisibilityHandler()(
                                            SelectionBoxes,
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
