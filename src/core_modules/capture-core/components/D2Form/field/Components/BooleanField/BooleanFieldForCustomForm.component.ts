import {
    BooleanField,
    withGotoInterface,
    withHideCompatibility,
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
);
