// @flow
import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import type { Enrollment, RenderFoundation } from '../../../../../../metaData';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';
import { EnrollmentRegistrationEntry } from '../../../../../DataEntries';
import { useSaveButtonText } from '../useSaveButtonText';

type Props = {
    theme: Theme,
    programId: string,
    enrollmentMetadata?: Enrollment,
    onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
};

const NewEnrollmentRelationship =
  ({
      theme,
      onSave,
      enrollmentMetadata,
      programId,
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
          />
      );
  };

export default withTheme()(NewEnrollmentRelationship);
