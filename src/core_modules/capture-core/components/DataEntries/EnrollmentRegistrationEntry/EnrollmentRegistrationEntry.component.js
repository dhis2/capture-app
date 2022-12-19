// @flow
import React, { type ComponentType, useState } from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { compose } from 'redux';
import { useHistory } from 'react-router-dom';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { ConfirmDialog } from '../../Dialogs/ConfirmDialog.component';
import { EnrollmentDataEntry } from '../Enrollment';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import type { Props, PlainProps } from './EnrollmentRegistrationEntry.types';
import { withSaveHandler } from '../../DataEntry';
import { withLoadingIndicator } from '../../../HOC';
import { InfoIconText } from '../../InfoIconText';
import { withErrorMessagePostProcessor } from '../withErrorMessagePostProcessor/withErrorMessagePostProcessor';
import { buildUrlQueryString } from '../../../utils/routing';
import { withDuplicateCheckOnSave } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';

const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
    marginLeft: {
        marginLeft: typography.pxToRem(16),
    },
});

const translatedTextWithStylesForProgram = (trackedEntityName: string, programName: string, orgUnitName: string, teiId?: ?string) => (
    teiId ? <span>
        {i18n.t('Saving a new enrollment in {{programName}} in {{orgUnitName}}.', {
            programName,
            orgUnitName,
            interpolation: { escapeValue: false },
        })}
    </span> : <span>
        {i18n.t('Saving a {{trackedEntityName}} in {{programName}} in {{orgUnitName}}.', {
            trackedEntityName,
            programName,
            orgUnitName,
            interpolation: { escapeValue: false },
        })}
    </span>);


const EnrollmentRegistrationEntryPlain =
  ({
      id,
      selectedScopeId,
      enrollmentMetadata,
      saveButtonText,
      classes,
      onSave,
      onPostProcessErrorMessage,
      orgUnitId,
      orgUnit,
      teiId,
      isUserInteractionInProgress,
      ...rest
  }: PlainProps) => {
      const { push } = useHistory();
      const [showWarning, setShowWarning] = useState(false);
      const { scopeType, trackedEntityName, programName } = useScopeInfo(selectedScopeId);
      const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);

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
                  scopeType === scopeTypes.TRACKER_PROGRAM && formId && orgUnit &&
                  <>
                      <EnrollmentDataEntry
                          orgUnit={orgUnit}
                          programId={selectedScopeId}
                          formFoundation={formFoundation}
                          enrollmentMetadata={enrollmentMetadata}
                          id={id}
                          onPostProcessErrorMessage={onPostProcessErrorMessage}
                          onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future')}
                          onUpdateField={() => console.log('onUpdateField will be here in the future')}
                          onStartAsyncUpdateField={() => console.log('onStartAsyncUpdateField will be here in the future')}
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
                          {translatedTextWithStylesForProgram(trackedEntityName.toLowerCase(), programName, orgUnit.name, teiId)}
                      </InfoIconText>
                  </>
              }
              <ConfirmDialog
                  header={i18n.t('Unsaved changes')}
                  text={i18n.t('Leaving this page will discard the selections you made for a new relationship')}
                  confirmText={i18n.t('Yes, discard')}
                  cancelText={i18n.t('No, stay here')}
                  onConfirm={navigateToWorkingListsPage}
                  open={!!showWarning}
                  onCancel={() => { setShowWarning(false); }}
              />
          </>
      );
  };

export const EnrollmentRegistrationEntryComponent: ComponentType<Props> =
  compose(
      withErrorMessagePostProcessor((({ enrollmentMetadata }) => enrollmentMetadata.trackedEntityType.name)),
      withLoadingIndicator(() => ({ height: '350px' })),
      withDuplicateCheckOnSave(),
      withSaveHandler({ onGetFormFoundation: ({ enrollmentMetadata }) => enrollmentMetadata && enrollmentMetadata.enrollmentForm, onIsCompleting: () => true }),
      withStyles(styles),
  )(EnrollmentRegistrationEntryPlain);
