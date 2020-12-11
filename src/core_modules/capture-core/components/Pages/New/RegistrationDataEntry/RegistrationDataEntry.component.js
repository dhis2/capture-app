// @flow
import React from 'react';
import type { OwnProps } from './RegistrationDataEntry.types';
import { EnrollmentRegistrationEntry, TeiRegistrationEntry } from '../../../DataEntries';
import { scopeTypes } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';

export const RegistrationDataEntry = ({ selectedScopeId, dataEntryId }: OwnProps) => {
  const { scopeType } = useScopeInfo(selectedScopeId);

  return (
    <>
      {scopeType === scopeTypes.TRACKER_PROGRAM && (
        <EnrollmentRegistrationEntry selectedScopeId={selectedScopeId} id={dataEntryId} />
      )}

      {scopeType === scopeTypes.TRACKED_ENTITY_TYPE && (
        <TeiRegistrationEntry selectedScopeId={selectedScopeId} id={dataEntryId} />
      )}
    </>
  );
};
