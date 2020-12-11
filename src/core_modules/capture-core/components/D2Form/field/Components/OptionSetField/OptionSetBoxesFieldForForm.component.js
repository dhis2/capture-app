// @flow
import {
  SelectionBoxes,
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
                    `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.optionSetBoxesLabel}`,
                })(
                  withDisplayMessages()(
                    withFilterProps(getFilteredProps)(
                      withRulesOptionVisibilityHandler()(SelectionBoxes),
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
