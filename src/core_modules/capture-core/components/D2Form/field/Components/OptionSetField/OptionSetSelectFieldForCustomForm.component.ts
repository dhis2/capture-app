import {
    SingleSelectField,
    withSelectSingleTranslations,
    withGotoInterface,
    withHideCompatibility,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
    withOptionsIconElement,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
    withCustomElementContainer,
    withRulesOptionVisibilityHandler,
} from '../internal';
import customFormStyles from './optionSetSelectFieldForCustomForm.module.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export const OptionSetSelectFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withFocusSaver()(
                    withCalculateMessages()(
                        withDisplayMessages()(
                            withSelectSingleTranslations()(
                                withCustomElementContainer(getContainerClass)(
                                    withOptionsIconElement()(
                                        withRulesOptionVisibilityHandler()(
                                            SingleSelectField,
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
