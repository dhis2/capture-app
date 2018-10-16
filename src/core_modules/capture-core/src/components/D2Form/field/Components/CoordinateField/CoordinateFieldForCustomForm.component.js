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
import withRequiredFieldCalculation from '../../withRequiredFieldCalculation';
import withCustomElementContainer from '../../withCustomElementContainer';
import customFormStyles from './coordinateFieldCustomForm.mod.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
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
