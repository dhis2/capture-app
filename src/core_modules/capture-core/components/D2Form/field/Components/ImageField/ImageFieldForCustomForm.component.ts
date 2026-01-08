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
import { D2Image } from '../../../../FormFields/Image/D2Image.component';

export const ImageFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withFocusSaver()(
                        withDisplayMessages()(
                            withCustomElementContainer()(
                                withInternalChangeHandler()(
                                    D2Image,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
