// @flow
import {
  VirtualizedSelectField,
  withSelectTranslations,
  withGotoInterface,
  withHideCompatibility,
  withDefaultShouldUpdateInterface,
  withFocusSaver,
  withCalculateMessages,
  withDefaultFieldContainer,
  withLabel,
  withDisplayMessages,
  withFilterProps,
} from '../../../../FormFields/New';
import { withRequiredFieldCalculation, withDisabledFieldCalculation } from '../internal';
import withOptionsIconElement from './withOptionsIconElement';
import labelTypeClasses from '../../buildField.module.css';
import withRulesOptionVisibilityHandler from './withRulesOptionVisibilityHandler';

const getFilteredProps = (props: Object) => {
  const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
  return passOnProps;
};

export default withGotoInterface()(
  withHideCompatibility()(
    withDefaultShouldUpdateInterface()(
      withDisabledFieldCalculation()(
        withRequiredFieldCalculation()(
          withFocusSaver()(
            withCalculateMessages()(
              withDefaultFieldContainer()(
                withLabel({
                  onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                  onGetCustomFieldLabeClass: (props: Object) =>
                    `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                })(
                  withDisplayMessages()(
                    withOptionsIconElement()(
                      withRulesOptionVisibilityHandler()(
                        withFilterProps(getFilteredProps)(
                          withSelectTranslations()(VirtualizedSelectField),
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
    ),
  ),
);
