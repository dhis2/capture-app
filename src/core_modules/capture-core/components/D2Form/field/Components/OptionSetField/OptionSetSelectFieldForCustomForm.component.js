// @flow
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
    withCustomElementContainer,
} from '../internal';
import {
    VirtualizedSelectField,
    withSelectTranslations,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
} from '../../../../FormFields/New';
import { withRulesOptionVisibilityHandler } from './withRulesOptionVisibilityHandler';
import { withOptionsIconElement } from './withOptionsIconElement';
import customFormStyles from './optionSetSelectFieldForCustomForm.module.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export const OptionSetSelectFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withFocusSaver()(
                        withCalculateMessages()(
                            withDisplayMessages()(
                                withSelectTranslations()(
                                    withCustomElementContainer(getContainerClass)(
                                        withOptionsIconElement()(
                                            withRulesOptionVisibilityHandler()(
                                                VirtualizedSelectField,
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
