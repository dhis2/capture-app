import {
    PolygonField,
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
import customFormStyles from './polygonFieldCustomForm.module.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export const PolygonFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withFocusSaver()(
                        withDisplayMessages()(
                            withCustomElementContainer(getContainerClass)(
                                withInternalChangeHandler()(
                                    PolygonField,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
