// @flow
import React from 'react';
import { withTheme } from '@material-ui/core';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import teiClasses from './trackedEntityInstance.module.css';
import { TeiRegistrationEntry } from '../../../../../DataEntries';
import { useSaveButtonText } from '../useSaveButtonText';
import type { Props } from './dataEntryTrackedEntityInstance.types';

const RelationshipTrackedEntityInstance =
  ({
      theme,
      onSave,
      teiRegistrationMetadata = {},
      duplicatesReviewPageSize,
      renderDuplicatesDialogActions,
      renderDuplicatesCardActions,
  }: Props) => {
      const fieldOptions = { theme, fieldLabelMediaBasedClass: teiClasses.fieldLabelMediaBased };
      const { trackedEntityType } = teiRegistrationMetadata || {};
      const saveButtonText = useSaveButtonText(trackedEntityType.name);

      return (
          <TeiRegistrationEntry
              id={DATA_ENTRY_ID}
              teiRegistrationMetadata={teiRegistrationMetadata}
              selectedScopeId={teiRegistrationMetadata.form.id}
              saveButtonText={saveButtonText}
              fieldOptions={fieldOptions}
              onSave={onSave}
              duplicatesReviewPageSize={duplicatesReviewPageSize}
              renderDuplicatesDialogActions={renderDuplicatesDialogActions}
              renderDuplicatesCardActions={renderDuplicatesCardActions}
          />
      );
  };

export default withTheme()(RelationshipTrackedEntityInstance);
