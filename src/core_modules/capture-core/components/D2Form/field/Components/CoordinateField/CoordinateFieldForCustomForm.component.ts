import {
    CoordinateField,
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
import customFormStyles from './coordinateFieldCustomForm.module.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export const CoordinateFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withFocusSaver()(
                        withDisplayMessages()(
                            withCustomElementContainer(getContainerClass)(
                                withInternalChangeHandler()(
                                    CoordinateField,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
