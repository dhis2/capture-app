// @flow
import React from 'react';
import { withTheme } from '@material-ui/core';
import type { TeiRegistration } from '../../../../../../metaData';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import teiClasses from './trackedEntityInstance.module.css';
import { TeiRegistrationEntry } from '../../../../../DataEntries';
import { useSaveButtonText } from '../useSaveButtonText';

type Props = {|
    theme: Theme,
    onSave: () => void,
    teiRegistrationMetadata?: TeiRegistration,
|};

const RelationshipTrackedEntityInstance =
  ({
      theme,
      onSave,
      teiRegistrationMetadata = {},
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
          />
      );
  };

export default withTheme()(RelationshipTrackedEntityInstance);
