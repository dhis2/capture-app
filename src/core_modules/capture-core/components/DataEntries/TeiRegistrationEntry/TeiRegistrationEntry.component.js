// @flow
import React from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';

export const TeiRegistrationEntryComponent = ({ selectedScopeId, id, ...rest }: OwnProps) => {
  const { scopeType } = useScopeInfo(selectedScopeId);
  const { formId, registrationMetaData, formFoundation } = useRegistrationFormInfoForSelectedScope(
    selectedScopeId,
  );
  const orgUnit = useCurrentOrgUnitInfo();

  return (
    <>
      {scopeType === scopeTypes.TRACKED_ENTITY_TYPE && formId && (
        <TrackedEntityInstanceDataEntry
          orgUnit={orgUnit}
          formFoundation={formFoundation}
          programId={selectedScopeId}
          teiRegistrationMetadata={registrationMetaData}
          id={id}
          {...rest}
        />
      )}
    </>
  );
};
