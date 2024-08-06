// @flow
import React, { type ComponentType, useState } from 'react';
import { compose } from 'redux';
import { Button, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitId } from '../../../hooks/useCurrentOrgUnitId';
import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';
import type { Props, PlainProps } from './TeiRegistrationEntry.types';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import { withSaveHandler } from '../../DataEntry';
import { InfoIconText } from '../../InfoIconText';
import { withErrorMessagePostProcessor } from '../withErrorMessagePostProcessor';
import { withDuplicateCheckOnSave } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';
import { useMetadataForRegistrationForm } from '../common/TEIAndEnrollment/useMetadataForRegistrationForm';

const translatedTextWithStylesForTei = (trackedEntityName, orgUnitName) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}}', {
            trackedEntityName, interpolation: { escapeValue: false } })
        } <b>{i18n.t('without')}</b> {i18n.t('enrollment')}
        {orgUnitName && <>{' '}{i18n.t('in')} <b>{orgUnitName}</b></>}.{' '}
        {i18n.t('Enroll in a program by selecting a program from the top bar.')}
    </>);

const styles = () => ({
    actions: {
        display: 'flex',
        gap: spacers.dp8,
    },
});

const TeiRegistrationEntryPlain =
  ({
      id,
      selectedScopeId,
      onSave,
      saveButtonText,
      teiRegistrationMetadata,
      fieldOptions,
      classes,
      onPostProcessErrorMessage,
      trackedEntityName,
      isUserInteractionInProgress,
      isSavingInProgress,
      onCancel,
      ...rest
  }: PlainProps) => {
      const [showWarning, setShowWarning] = useState(false);
      const { scopeType } = useScopeInfo(selectedScopeId);
      const { formId, formFoundation } = useMetadataForRegistrationForm({ selectedScopeId });
      const orgUnitId = useCurrentOrgUnitId();
      const { displayName: orgUnitName } = useOrgUnitNameWithAncestors(orgUnitId);

      const handleOnCancel = () => {
          if (!isUserInteractionInProgress) {
              onCancel();
          } else {
              setShowWarning(true);
          }
      };

      return (
          <>
              {
                  scopeType === scopeTypes.TRACKED_ENTITY_TYPE && formId &&
                  <>
                      <TrackedEntityInstanceDataEntry
                          orgUnitId={orgUnitId}
                          formFoundation={formFoundation}
                          trackedEntityTypeId={selectedScopeId}
                          teiRegistrationMetadata={teiRegistrationMetadata}
                          id={id}
                          fieldOptions={fieldOptions}
                          onPostProcessErrorMessage={onPostProcessErrorMessage}
                          onGetUnsavedAttributeValues={() => console.log('similar to the withErrorMessagePostProcessor this will come in the future')}
                          {...rest}
                      />
                      <div className={classes.actions}>
                          {
                              onSave &&
                              <Button
                                  dataTest="create-and-link-button"
                                  primary
                                  onClick={onSave}
                                  loading={isSavingInProgress}
                              >
                                  {saveButtonText}
                              </Button>
                          }

                          <Button
                              dataTest="cancel-button"
                              secondary
                              onClick={handleOnCancel}
                              disabled={isSavingInProgress}
                          >
                              {i18n.t('Cancel')}
                          </Button>
                      </div>
                      <InfoIconText>
                          {translatedTextWithStylesForTei(trackedEntityName.toLowerCase(), orgUnitName)}
                      </InfoIconText>

                      <DiscardDialog
                          {...defaultDialogProps}
                          onDestroy={onCancel}
                          open={!!showWarning}
                          onCancel={() => { setShowWarning(false); }}
                      />
                  </>
              }
          </>
      );
  };

export const TeiRegistrationEntryComponent: ComponentType<Props> =
  compose(
      withErrorMessagePostProcessor((({ trackedEntityName }) => trackedEntityName)),
      withDuplicateCheckOnSave(),
      withSaveHandler({ onGetFormFoundation: ({ teiRegistrationMetadata }) => {
          const form = teiRegistrationMetadata && teiRegistrationMetadata.form;
          return form;
      } }),
      withStyles(styles),
  )(TeiRegistrationEntryPlain);
