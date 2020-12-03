// @flow
import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import type { Enrollment, RenderFoundation } from '../../../../../../metaData';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';
import { EnrollmentRegistrationEntry } from '../../../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.component';
import { useSaveButtonText } from '../useSaveButtonText';

type Props = {
    theme: Theme,
    programId: string,
    enrollmentMetadata?: Enrollment,
    onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
    onPostProcessErrorMessage: Function,
    onGetUnsavedAttributeValues: Function,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Function,
};

const NewEnrollmentRelationship =
  ({
      theme,
      onSave,
      onPostProcessErrorMessage,
      onGetUnsavedAttributeValues,
      enrollmentMetadata,
      programId,
      onUpdateField,
      onStartAsyncUpdateField,
  }: Props) => {
      const fieldOptions = { theme, fieldLabelMediaBasedClass: enrollmentClasses.fieldLabelMediaBased };
      const { trackedEntityType } = enrollmentMetadata || {};
      const saveButtonText = useSaveButtonText(trackedEntityType.name);

      return (
          <EnrollmentRegistrationEntry
              id={DATA_ENTRY_ID}
              enrollmentMetadata={enrollmentMetadata}
              selectedScopeId={programId}
              saveButtonText={saveButtonText}
              fieldOptions={fieldOptions}
              onSave={onSave}
              onPostProcessErrorMessage={onPostProcessErrorMessage}
              onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
              onUpdateField={onUpdateField}
              onStartAsyncUpdateField={onStartAsyncUpdateField}
          />
      );
  };

export default withTheme()(NewEnrollmentRelationship);
