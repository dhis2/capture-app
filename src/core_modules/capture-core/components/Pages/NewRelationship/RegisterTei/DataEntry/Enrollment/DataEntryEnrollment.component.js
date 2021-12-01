// @flow
import i18n from '@dhis2/d2-i18n';
import { withTheme } from '@material-ui/core/styles';
import React from 'react';
import { EnrollmentRegistrationEntry } from '../../../../../DataEntries';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import type { Props } from './dataEntryEnrollment.types';
import enrollmentClasses from './enrollment.module.css';

const NewEnrollmentRelationshipPlain =
  ({
      theme,
      onSave,
      enrollmentMetadata,
      programId,
      duplicatesReviewPageSize,
      renderDuplicatesDialogActions,
      renderDuplicatesCardActions,
  }: Props) => {
      const fieldOptions = { theme, fieldLabelMediaBasedClass: enrollmentClasses.fieldLabelMediaBased };
      const { trackedEntityType } = enrollmentMetadata || {};
      const trackedEntityTypeNameLC = trackedEntityType.name.toLocaleLowerCase();

      return (
          <EnrollmentRegistrationEntry
              id={DATA_ENTRY_ID}
              enrollmentMetadata={enrollmentMetadata}
              selectedScopeId={programId}
              saveButtonText={i18n.t('Save new {{trackedEntityTypeName}} and link', {
                  trackedEntityTypeName: trackedEntityTypeNameLC,
                  interpolation: { escapeValue: false },
              })}
              fieldOptions={fieldOptions}
              onSave={onSave}
              duplicatesReviewPageSize={duplicatesReviewPageSize}
              renderDuplicatesDialogActions={renderDuplicatesDialogActions}
              renderDuplicatesCardActions={renderDuplicatesCardActions}
          />
      );
  };

export const NewEnrollmentRelationship = withTheme()(NewEnrollmentRelationshipPlain);
