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
import {
  withRequiredFieldCalculation,
  withDisabledFieldCalculation,
  withCustomElementContainer,
} from '../internal';
import withOptionsIconElement from './withOptionsIconElement';
import customFormStyles from './optionSetSelectFieldForCustomForm.module.css';
import withRulesOptionVisibilityHandler from './withRulesOptionVisibilityHandler';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export default withGotoInterface()(
  withHideCompatibility()(
    withDefaultShouldUpdateInterface()(
      withDisabledFieldCalculation()(
        withRequiredFieldCalculation()(
          withFocusSaver()(
            withCalculateMessages()(
              withDisplayMessages()(
                withSelectTranslations()(
                  withCustomElementContainer(getContainerClass)(
                    withOptionsIconElement()(
                      withRulesOptionVisibilityHandler()(VirtualizedSelectField),
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
