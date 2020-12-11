// @flow
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import { startNewEnrollmentDataEntryInitialisation } from './EnrollmentRegistrationEntry.actions';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { scopeTypes } from '../../../metaData';

const useInitialiseEnrollmentRegistration = (selectedScopeId, dataEntryId) => {
  const dispatch = useDispatch();
  const { scopeType } = useScopeInfo(selectedScopeId);
  const { id: selectedOrgUnitId } = useCurrentOrgUnitInfo();
  const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
  const registrationFormReady = !!formId;
  useEffect(() => {
    if (registrationFormReady && scopeType === scopeTypes.TRACKER_PROGRAM) {
      dispatch(
        startNewEnrollmentDataEntryInitialisation({
          selectedOrgUnitId,
          selectedScopeId,
          dataEntryId,
          formFoundation,
        }),
      );
    }
  }, [
    scopeType,
    dataEntryId,
    selectedScopeId,
    selectedOrgUnitId,
    registrationFormReady,
    formFoundation,
    dispatch,
  ]);
};

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = ({
  selectedScopeId,
  id,
  ...rest
}) => {
  useInitialiseEnrollmentRegistration(selectedScopeId, id);

  return (
    <EnrollmentRegistrationEntryComponent selectedScopeId={selectedScopeId} id={id} {...rest} />
  );
};
