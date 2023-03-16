// @flow
import React, { type ComponentType, useState } from 'react';
import { compose } from 'redux';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import type { Props, PlainProps } from './TeiRegistrationEntry.types';
import { ConfirmDialog } from '../../Dialogs/ConfirmDialog.component';
import { withSaveHandler } from '../../DataEntry';
import { InfoIconText } from '../../InfoIconText';
import { withErrorMessagePostProcessor } from '../withErrorMessagePostProcessor';
import { buildUrlQueryString } from '../../../utils/routing';
import { withDuplicateCheckOnSave } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';
import { defaultDialogProps } from '../../Dialogs/ConfirmDialog.constants';
import { useMetadataForRegistrationForm } from '../../../hooks/useMetadataForRegistrationForm';

const translatedTextWithStylesForTei = (trackedEntityName, orgUnitName) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}}', {
            trackedEntityName, interpolation: { escapeValue: false } })
        } <b>{i18n.t('without')}</b> {i18n.t('enrollment')}
        {orgUnitName && <>{' '}{i18n.t('in')} <b>{orgUnitName}</b></>}.{' '}
        {i18n.t('Enroll in a program by selecting a program from the top bar.')}
    </>);

const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
    marginLeft: {
        marginLeft: typography.pxToRem(16),
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
      ...rest
  }: PlainProps) => {
      const { push } = useHistory();
      const [showWarning, setShowWarning] = useState(false);
      const { scopeType } = useScopeInfo(selectedScopeId);
      const { formId, formFoundation } = useMetadataForRegistrationForm({ selectedScopeId });
      const orgUnit = useCurrentOrgUnitInfo();

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
                buildUrlQueryString({ programId: selectedScopeId, orgUnitId: orgUnit.id })
                :
                buildUrlQueryString({ orgUnitId: orgUnit.id });
          return push(`/?${url}`);
      };

      return (
          <>
              {
                  scopeType === scopeTypes.TRACKED_ENTITY_TYPE && formId &&
                  <>
                      {/* $FlowFixMe */}
                      <TrackedEntityInstanceDataEntry
                          orgUnit={orgUnit}
                          formFoundation={formFoundation}
                          trackedEntityTypeId={selectedScopeId}
                          teiRegistrationMetadata={teiRegistrationMetadata}
                          id={id}
                          fieldOptions={fieldOptions}
                          onPostProcessErrorMessage={onPostProcessErrorMessage}
                          onGetUnsavedAttributeValues={() => console.log('similar to the withErrorMessagePostProcessor this will come in the future')}
                          {...rest}
                      />
                      <div className={classes.marginTop}>
                          {
                              onSave &&
                              <Button
                                  dataTest="create-and-link-button"
                                  primary
                                  onClick={onSave}
                              >
                                  {saveButtonText}
                              </Button>
                          }

                          <Button
                              dataTest="cancel-button"
                              secondary
                              onClick={handleOnCancel}
                              className={classes.marginLeft}
                          >
                              {i18n.t('Cancel')}
                          </Button>
                      </div>
                      <InfoIconText>
                          {translatedTextWithStylesForTei(trackedEntityName.toLowerCase(), orgUnit.name)}
                      </InfoIconText>

                      <ConfirmDialog
                          {...defaultDialogProps}
                          onConfirm={navigateToWorkingListsPage}
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
