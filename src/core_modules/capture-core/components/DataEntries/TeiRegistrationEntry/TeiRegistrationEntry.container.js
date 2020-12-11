// @flow
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { scopeTypes } from '../../../metaData';
import { startNewTeiDataEntryInitialisation } from './TeiRegistrationEntry.actions';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { TeiRegistrationEntryComponent } from './TeiRegistrationEntry.component';

const useInitialiseTeiRegistration = (selectedScopeId, dataEntryId) => {
  const dispatch = useDispatch();
  const { scopeType } = useScopeInfo(selectedScopeId);
  const { id: selectedOrgUnitId } = useCurrentOrgUnitInfo();
  const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
  const registrationFormReady = !!formId;
  useEffect(() => {
    if (registrationFormReady && scopeType === scopeTypes.TRACKED_ENTITY_TYPE) {
      dispatch(
        startNewTeiDataEntryInitialisation({
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

export const TeiRegistrationEntry: ComponentType<OwnProps> = ({ selectedScopeId, id, ...rest }) => {
  useInitialiseTeiRegistration(selectedScopeId, id);

  return <TeiRegistrationEntryComponent selectedScopeId={selectedScopeId} id={id} {...rest} />;
};
