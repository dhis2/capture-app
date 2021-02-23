// @flow
import React, { type ComponentType } from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { compose } from 'redux';
import { useHistory } from 'react-router';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { EnrollmentDataEntry } from '../Enrollment';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import type { HOCProps, Props } from './EnrollmentRegistrationEntry.types';
import { withSaveHandler } from '../../DataEntry';
import { withLoadingIndicator } from '../../../HOC';
import { InfoIconText } from '../../InfoIconText';
import withErrorMessagePostProcessor from '../withErrorMessagePostProcessor/withErrorMessagePostProcessor';
import { urlArguments } from '../../../utils/url';

const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
    marginLeft: {
        marginLeft: typography.pxToRem(16),
    },
});

const translatedTextWithStylesForProgram = (trackedEntityName: string, programName: string, orgUnitName: string) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}} in', { trackedEntityName })} <b>{programName}</b>
        {orgUnitName && <>{' '}{i18n.t('in')} <b>{orgUnitName}</b></>}.
    </>);


const EnrollmentRegistrationEntryPlain =
  ({
      id,
      selectedScopeId,
      enrollmentMetadata,
      saveButtonText,
      classes,
      onSave,
      onPostProcessErrorMessage,
      ...rest
  }: Props) => {
      const { push } = useHistory();

      const { scopeType, trackedEntityName, programName } = useScopeInfo(selectedScopeId);
      const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
      const orgUnit = useCurrentOrgUnitInfo();

      const navigateToWorkingListsPage = () => {
          const url =
            scopeType === scopeTypes.TRACKER_PROGRAM
                ?
                urlArguments({ programId: selectedScopeId, orgUnitId: orgUnit.id })
                :
                urlArguments({ orgUnitId: orgUnit.id });
          return push(`/?${url}`);
      };

      return (
          <>
              {
                  scopeType === scopeTypes.TRACKER_PROGRAM && formId &&
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
                                  dataTest="dhis2-capture-create-and-link-button"
                                  primary
                                  onClick={onSave}
                              >
                                  {saveButtonText}
                              </Button>
                          }

                          <Button
                              dataTest="dhis2-capture-create-and-link-button"
                              secondary
                              onClick={navigateToWorkingListsPage}
                              className={classes.marginLeft}
                          >
                              {i18n.t('Cancel')}
                          </Button>
                      </div>

                      <InfoIconText>
                          {translatedTextWithStylesForProgram(trackedEntityName.toLowerCase(), programName, orgUnit.name)}
                      </InfoIconText>
                  </>
              }
          </>
      );
  };

export const EnrollmentRegistrationEntryComponent: ComponentType<$Diff<Props, HOCProps>> =
  compose(
      withErrorMessagePostProcessor(),
      withLoadingIndicator(() => ({ height: '350px' })),
      withSaveHandler({ onGetFormFoundation: ({ enrollmentMetadata }) => enrollmentMetadata && enrollmentMetadata.enrollmentForm }),
      withStyles(styles),
  )(EnrollmentRegistrationEntryPlain);
