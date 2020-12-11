// @flow
import type { ComponentType } from 'react';
import {
  withGotoInterface,
  withHideCompatibility,
  withDefaultShouldUpdateInterface,
  withFocusSaver,
  withCalculateMessages,
  withDefaultFieldContainer,
  withLabel,
  withDisplayMessages,
  withFilterProps,
  withInternalChangeHandler,
} from '../../../../../FormFields/New';
import withDisabledFieldCalculation from '../withDisabledFieldCalculation/withDisabledFieldCalculation';
import withRequiredFieldCalculation from '../withRequiredFieldCalculation/withRequiredFieldCalculation';
import labelTypeClasses from '../../../buildField.module.css';

const getFilteredProps = (props: Object) => {
  const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
  return passOnProps;
};

export default () => (InnerComponent: ComponentType<any>) =>
  withGotoInterface()(
    withHideCompatibility()(
      withDefaultShouldUpdateInterface()(
        withDisabledFieldCalculation()(
          withRequiredFieldCalculation()(
            withCalculateMessages()(
              withFocusSaver()(
                withDefaultFieldContainer()(
                  withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) =>
                      `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                  })(
                    withDisplayMessages()(
                      withFilterProps(getFilteredProps)(
                        withInternalChangeHandler()(InnerComponent),
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
