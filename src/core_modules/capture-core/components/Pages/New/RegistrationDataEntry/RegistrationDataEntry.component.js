// @flow
import React from 'react';
import type { OwnProps } from './RegistrationDataEntry.types';
import { EnrollmentRegistrationEntry } from '../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.component';
import { TeiRegistrationEntry } from '../../../DataEntries/TeiRegistrationEntry/TeiRegistrationEntry.component';
import { scopeTypes } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';


export const RegistrationDataEntry = ({ selectedScopeId, dataEntryId }: OwnProps) => {
    const { scopeType } = useScopeInfo(selectedScopeId);

    return (
        <>
            {
                scopeType === scopeTypes.TRACKER_PROGRAM &&
                <EnrollmentRegistrationEntry
                    selectedScopeId={selectedScopeId}
                    id={dataEntryId}
                    onSave={() => alert('this is save in the future')}
                />
            }

            {
                scopeType === scopeTypes.TRACKED_ENTITY_TYPE &&
                <TeiRegistrationEntry
                    selectedScopeId={selectedScopeId}
                    id={dataEntryId}
                    onSave={() => alert('this is save in the future')}
                />
            }

        </>
    );
};
