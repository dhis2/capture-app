// @flow
import {
    VirtualizedMultiSelectField,
    withSelectMultiTranslations,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
    withOptionsIconElement,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
    withCustomElementContainer,
} from '../internal';
import customFormStyles from './optionSetSelectFieldForCustomForm.module.css';
import { withRulesOptionVisibilityHandler } from './withRulesOptionVisibilityHandler';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export const MultiOptionSetSelectFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withFocusSaver()(
                        withCalculateMessages()(
                            withDisplayMessages()(
                                withSelectMultiTranslations()(
                                    withCustomElementContainer(getContainerClass)(
                                        withOptionsIconElement()(
                                            withRulesOptionVisibilityHandler()(
                                                VirtualizedMultiSelectField,
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
