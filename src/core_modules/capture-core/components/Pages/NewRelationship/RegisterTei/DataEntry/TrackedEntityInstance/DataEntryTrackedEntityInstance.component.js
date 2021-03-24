// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withTheme } from '@material-ui/core';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import teiClasses from './trackedEntityInstance.module.css';
import { TeiRegistrationEntry } from '../../../../../DataEntries';
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
      const trackedEntityTypeNameLC = trackedEntityType.name.toLocaleLowerCase();

      return (
          <TeiRegistrationEntry
              id={DATA_ENTRY_ID}
              teiRegistrationMetadata={teiRegistrationMetadata}
              selectedScopeId={teiRegistrationMetadata.form.id}
              saveButtonText={i18n.t('Save new {{trackedEntityTypeName}} and link', { trackedEntityTypeName: trackedEntityTypeNameLC })}
              fieldOptions={fieldOptions}
              onSave={onSave}
              duplicatesReviewPageSize={duplicatesReviewPageSize}
              renderDuplicatesDialogActions={renderDuplicatesDialogActions}
              renderDuplicatesCardActions={renderDuplicatesCardActions}
          />
      );
  };

export default withTheme()(RelationshipTrackedEntityInstance);
