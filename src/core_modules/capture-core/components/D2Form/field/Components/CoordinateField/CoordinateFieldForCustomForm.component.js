// @flow
import {
    CoordinateField,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
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
import customFormStyles from './coordinateFieldCustomForm.mod.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
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
    ),
);
