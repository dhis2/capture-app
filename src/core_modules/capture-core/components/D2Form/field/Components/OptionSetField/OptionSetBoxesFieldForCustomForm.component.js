// @flow
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
} from '../internal';
import {
    SelectionBoxes,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
} from '../../../../FormFields/New';
import { withRulesOptionVisibilityHandler } from './withRulesOptionVisibilityHandler';

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
