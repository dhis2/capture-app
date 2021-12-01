// @flow
import i18n from '@dhis2/d2-i18n';
import { withTheme } from '@material-ui/core';
import React from 'react';
import { TeiRegistrationEntry } from '../../../../../DataEntries';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import type { Props } from './dataEntryTrackedEntityInstance.types';
import teiClasses from './trackedEntityInstance.module.css';

const RelationshipTrackedEntityInstancePlain =
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
      const trackedEntityTypeNameLC = trackedEntityType.name.toLocaleLowerCase();

      return (
          <TeiRegistrationEntry
              id={DATA_ENTRY_ID}
              teiRegistrationMetadata={teiRegistrationMetadata}
              selectedScopeId={teiRegistrationMetadata.form.id}
              saveButtonText={i18n.t('Save new {{trackedEntityTypeName}} and link', {
                  trackedEntityTypeName: trackedEntityTypeNameLC, interpolation: { escapeValue: false },
              })}
              fieldOptions={fieldOptions}
              onSave={onSave}
              duplicatesReviewPageSize={duplicatesReviewPageSize}
              renderDuplicatesDialogActions={renderDuplicatesDialogActions}
              renderDuplicatesCardActions={renderDuplicatesCardActions}
          />
      );
  };

export const RelationshipTrackedEntityInstance = withTheme()(RelationshipTrackedEntityInstancePlain);
