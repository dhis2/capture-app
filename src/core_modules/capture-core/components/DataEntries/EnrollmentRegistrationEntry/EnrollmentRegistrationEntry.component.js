// @flow
import React from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { EnrollmentDataEntry } from '../Enrollment';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { withSaveHandler } from '../../DataEntry';

const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
});
export const EnrollmentRegistrationEntryComponent = ({ selectedScopeId, id, ...rest }: OwnProps) => {
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { formId, registrationMetaData, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();

const EnrollmentRegistrationEntryPlain =
  ({
      id,
      selectedScopeId,
      enrollmentMetadata,
      saveButtonText,
      classes,
      onSave,
      ...rest
  }: {...OwnProps, ...CssClasses}) => {
      const { scopeType } = useScopeInfo(selectedScopeId);
      useDataEntryLifecycle(selectedScopeId, id, scopeType);
      const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
      const orgUnit = useCurrentOrgUnitInfo();

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
                          {...rest}
                      />
                      {
                          onSave &&
                          <Button
                              dataTest="dhis2-capture-create-and-link-button"
                              primary
                              onClick={onSave}
                              className={classes.marginTop}
                          >
                              {saveButtonText}
                          </Button>
                      }

                  </>
              }
          </>
      );
  };

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> =
  compose(
      withSaveHandler({ onGetFormFoundation: ({ enrollmentMetadata }) => enrollmentMetadata && enrollmentMetadata.enrollmentForm }),
      withStyles(styles),
  )(EnrollmentRegistrationEntryPlain);
