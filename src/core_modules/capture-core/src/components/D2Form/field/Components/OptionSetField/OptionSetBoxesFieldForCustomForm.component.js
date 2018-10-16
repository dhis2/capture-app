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
import withRequiredFieldCalculation from '../../withRequiredFieldCalculation';

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withRequiredFieldCalculation()(
                withFocusSaver()(
                    withCalculateMessages()(
                        withDisplayMessages()(
                            SelectionBoxes,
                        ),
                    ),
                ),
            ),
        ),
    ),
);
