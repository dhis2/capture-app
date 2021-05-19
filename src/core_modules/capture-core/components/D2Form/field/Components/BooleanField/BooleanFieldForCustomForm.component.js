// @flow
import {
    BooleanField,
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
    withCustomElementContainer,
} from '../internal';

export const BooleanFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withCalculateMessages()(
                        withFocusSaver()(
                            withDisplayMessages()(
                                withCustomElementContainer()(
                                    BooleanField,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
