// @flow
import { withTransformPropName } from '../../../../../HOC';
import UserNameField from '../../../../FormFields/UserField/UserField.component';
import {
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
import customFormStyles from './userNameFieldCustomForm.module.css';

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
                                    withTransformPropName(['onBlur', 'onSet'])(
                                        withInternalChangeHandler()(
                                            UserNameField,
                                        ),
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
