// @flow
// TODO: To use this: Create new multiSelectionBoxes and reimplement this file
import {
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withCalculateMessages,
    withDefaultFieldContainer,
    withDisplayMessages,
    withConvertedOptionSet,
} from '../../../../FormFields/New';
import withRequiredFieldCalculation from '../../withRequiredFieldCalculation';
import SelectBoxes from '../../../../FormFields/Options/SelectBoxes/SelectBoxes.component';

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withDefaultFieldContainer()(
                        withDisplayMessages()(
                            withConvertedOptionSet()(SelectBoxes),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
