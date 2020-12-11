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
import {
  withRequiredFieldCalculation,
  withDisabledFieldCalculation,
  withCustomElementContainer,
} from '../internal';
import ImageField from '../../../../FormFields/Image/D2Image.component';

export default withGotoInterface()(
  withHideCompatibility()(
    withDefaultShouldUpdateInterface()(
      withDisabledFieldCalculation()(
        withRequiredFieldCalculation()(
          withCalculateMessages()(
            withFocusSaver()(
              withDisplayMessages()(
                withCustomElementContainer()(withInternalChangeHandler()(ImageField)),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
