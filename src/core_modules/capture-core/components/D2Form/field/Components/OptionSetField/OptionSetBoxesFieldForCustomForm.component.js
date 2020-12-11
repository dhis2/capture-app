// @flow
import {
  SelectionBoxes,
  withGotoInterface,
  withHideCompatibility,
  withDefaultShouldUpdateInterface,
  withFocusSaver,
  withCalculateMessages,
  withDisplayMessages,
} from '../../../../FormFields/New';
import { withRequiredFieldCalculation, withDisabledFieldCalculation } from '../internal';
import withRulesOptionVisibilityHandler from './withRulesOptionVisibilityHandler';

export default withGotoInterface()(
  withHideCompatibility()(
    withDefaultShouldUpdateInterface()(
      withDisabledFieldCalculation()(
        withRequiredFieldCalculation()(
          withFocusSaver()(
            withCalculateMessages()(
              withDisplayMessages()(withRulesOptionVisibilityHandler()(SelectionBoxes)),
            ),
          ),
        ),
      ),
    ),
  ),
);
