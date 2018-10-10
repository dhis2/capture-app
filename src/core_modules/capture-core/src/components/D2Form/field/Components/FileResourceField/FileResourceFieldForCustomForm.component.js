// @flow
import {
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
    withInternalChangeHandler,
} from '../../../../FormFields/New';
import withRequiredFieldCalculation from '../../withRequiredFieldCalculation';
import FileField from '../../../../FormFields/File/D2File.component';
import withCustomElementContainer from '../../withCustomElementContainer';

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withFocusSaver()(
                        withDisplayMessages()(
                            withCustomElementContainer()(
                                withInternalChangeHandler()(
                                    FileField,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
