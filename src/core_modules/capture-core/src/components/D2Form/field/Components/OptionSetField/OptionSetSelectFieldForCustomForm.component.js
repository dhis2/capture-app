// @flow
import {
    VirtualizedSelectField,
    withSelectTranslations,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
} from '../../../../FormFields/New';
import withRequiredFieldCalculation from '../../withRequiredFieldCalculation';
import withCustomElementContainer from '../../withCustomElementContainer';
import customFormStyles from './optionSetSelectFieldForCustomForm.mod.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withRequiredFieldCalculation()(
                withFocusSaver()(
                    withCalculateMessages()(
                        withDisplayMessages()(
                            withSelectTranslations()(
                                withCustomElementContainer(getContainerClass)(
                                    VirtualizedSelectField,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
