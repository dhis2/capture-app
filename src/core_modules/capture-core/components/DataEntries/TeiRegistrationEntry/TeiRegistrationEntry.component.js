// @flow
import React, { type ComponentType, useState } from 'react';
import { compose } from 'redux';
import { Button, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitId } from '../../../hooks/useCurrentOrgUnitId';
import { useReduxOrgUnit } from '../../../redux/organisationUnits';
import type { Props, PlainProps } from './TeiRegistrationEntry.types';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import { withSaveHandler } from '../../DataEntry';
import { InfoIconText } from '../../InfoIconText';
import { withErrorMessagePostProcessor } from '../withErrorMessagePostProcessor';
import { buildUrlQueryString } from '../../../utils/routing';
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
      ...rest
  }: PlainProps) => {
      const { push } = useHistory();
      const [showWarning, setShowWarning] = useState(false);
      const { scopeType } = useScopeInfo(selectedScopeId);
      const { formId, formFoundation } = useMetadataForRegistrationForm({ selectedScopeId });
      const orgUnitId = useCurrentOrgUnitId();
      const { orgUnit } = useReduxOrgUnit(orgUnitId); // Tony: [DHIS2-15814] Change this to new hook
      const orgUnitName = orgUnit ? orgUnit.name : '';

      const handleOnCancel = () => {
          if (!isUserInteractionInProgress) {
              navigateToWorkingListsPage();
          } else {
              setShowWarning(true);
          }
      };

      const navigateToWorkingListsPage = () => {
          const url =
            scopeType === scopeTypes.TRACKER_PROGRAM
                ?
                buildUrlQueryString({ programId: selectedScopeId, orgUnitId })
                :
                buildUrlQueryString({ orgUnitId });
          return push(`/?${url}`);
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
                          onDestroy={navigateToWorkingListsPage}
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
