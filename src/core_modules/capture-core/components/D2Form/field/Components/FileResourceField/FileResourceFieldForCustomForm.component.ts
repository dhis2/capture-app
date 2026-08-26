import {
    withGotoInterface,
    withHideCompatibility,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
    withInternalChangeHandler,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
    withCustomElementContainer,
} from '../internal';
import { D2File } from '../../../../FormFields/File/D2File.component';

export const FileResourceFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withFocusSaver()(
                        withDisplayMessages()(
                            withCustomElementContainer()(
                                withInternalChangeHandler()(
                                    D2File,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
