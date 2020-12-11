// @flow
import * as React from 'react';
import ErrorAndWarningDialog from './ErrorAndWarningDialog.component';
import ErrorDialog from './ErrorDialog.component';
import WarningDialog from './WarningDialog.component';

import { validationStrategies } from '../../../../metaData/RenderFoundation/renderFoundation.const';

type Props = {
  open: boolean,
  warnings: ?Array<{ key: string, name: ?string, warning: string }>,
  errors: ?Array<{ key: string, name: ?string, error: string }>,
  isCompleting: boolean,
  validationStrategy: $Values<typeof validationStrategies>,
};

function isSaveAllowedWithErrors(
  isCompleting: boolean,
  validationStrategy: $Values<typeof validationStrategies>,
) {
  if (validationStrategy === validationStrategies.NONE) {
    return true;
  }

  if (validationStrategy === validationStrategies.ON_COMPLETE) {
    return !isCompleting;
  }

  return false;
}

const MessagesDialogContents = (props: Props) => {
  const { open, warnings, errors, isCompleting, validationStrategy, ...passOnProps } = props;
  if (!open) {
    return null;
  }

  if (warnings && warnings.length > 0 && errors && errors.length > 0) {
    return (
      // $FlowFixMe[cannot-spread-inexact] automated comment
      <ErrorAndWarningDialog
        errors={errors}
        warnings={warnings}
        saveEnabled={isSaveAllowedWithErrors(isCompleting, validationStrategy)}
        {...passOnProps}
      />
    );
  }

  if (errors && errors.length > 0) {
    return (
      // $FlowFixMe
      <ErrorDialog
        errors={errors}
        saveEnabled={isSaveAllowedWithErrors(isCompleting, validationStrategy)}
        {...passOnProps}
      />
    );
  }

  return (
    // $FlowFixMe
    <WarningDialog warnings={warnings} {...passOnProps} />
  );
};

export default MessagesDialogContents;
