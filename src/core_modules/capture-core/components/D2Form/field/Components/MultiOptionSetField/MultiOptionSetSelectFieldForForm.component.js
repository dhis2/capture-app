// @flow
import {
    VirtualizedMultiSelectField,
    withSelectMultiTranslations,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
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
} from '../internal';
import labelTypeClasses from '../../buildField.module.css';
import { withRulesOptionVisibilityHandler } from './withRulesOptionVisibilityHandler';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const MultiOptionSetSelectFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
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
                                        withOptionsIconElement()(
                                            withRulesOptionVisibilityHandler()(
                                                withFilterProps(getFilteredProps)(
                                                    withSelectMultiTranslations()(VirtualizedMultiSelectField),
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
    ),
);
