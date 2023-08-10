// @flow
import {
    SelectionBoxes,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
    withRulesOptionVisibilityHandler,
} from '../internal';

export const OptionSetBoxesFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withFocusSaver()(
                        withCalculateMessages()(
                            withDisplayMessages()(
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
);
