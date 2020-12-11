// @flow
import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import type { Enrollment, RenderFoundation } from '../../../../../../metaData';
import ConfiguredEnrollment from './ConfiguredEnrollment.component';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';

type Props = {
  enrollmentMetadata: Enrollment,
  onUpdateField: (innerAction: ReduxAction<any, any>) => void,
  onStartAsyncUpdateField: Object,
  programId: string,
  onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
  onPostProcessErrorMessage: Function,
  onGetUnsavedAttributeValues: (Function) => void,
  onCancel: () => void,
  classes: {
    fieldLabelMediaBased: string,
  },
  theme: Theme,
};

const NewEnrollmentRelationship = (props: Props) => {
  const fieldOptions = {
    theme: props.theme,
    fieldLabelMediaBasedClass: enrollmentClasses.fieldLabelMediaBased,
  };

  const handleSave = (itemId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
    props.onSave(itemId, dataEntryId, formFoundation);
  };

  const {
    classes,
    theme,
    onSave,
    onPostProcessErrorMessage,
    onGetUnsavedAttributeValues,
    enrollmentMetadata,
    ...passOnProps
  } = props;
  const selectedProgramId = passOnProps.programId;

  return (
    // $FlowFixMe[cannot-spread-inexact] automated comment
    <ConfiguredEnrollment
      id={DATA_ENTRY_ID}
      enrollmentMetadata={enrollmentMetadata}
      selectedScopeId={selectedProgramId}
      fieldOptions={fieldOptions}
      onSave={handleSave}
      onPostProcessErrorMessage={onPostProcessErrorMessage}
      onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
      {...passOnProps}
    />
  );
};

export default withTheme()(NewEnrollmentRelationship);
