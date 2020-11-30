// @flow
import React from 'react';
import type { OwnProps } from './RegistrationDataEntry.types';
import { EnrollmentRegistrationEntry } from '../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.component';
import { TeiRegistrationEntry } from '../../../DataEntries/TeiRegistrationEntry/TeiRegistrationEntry.component';
import { scopeTypes } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../../../DataEntries/common/useRegistrationFormInfoForSelectedScope';


export const RegistrationDataEntry = ({ selectedScopeId, dataEntryId }: OwnProps) => {
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { registrationMetaData } = useRegistrationFormInfoForSelectedScope(selectedScopeId);

    return (
        <>
            {
                scopeType === scopeTypes.TRACKER_PROGRAM &&
                <EnrollmentRegistrationEntry
                    id={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    enrollmentMetadata={registrationMetaData}
                    saveButtonText={'Save new'}
                    onSave={() => alert('onSave will save in the future')}
                    onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future in the future')}
                    onPostProcessErrorMessage={() => console.log('onPostProcessErrorMessage will be here in the future in the future')}
                    onUpdateField={() => console.log('onUpdateField will be here in the future in the future')}
                    onStartAsyncUpdateField={() => console.log('onStartAsyncUpdateField will be here in the future in the future')}
                />
            }

            {
                scopeType === scopeTypes.TRACKED_ENTITY_TYPE &&
                <TeiRegistrationEntry
                    id={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    teiRegistrationMetadata={registrationMetaData}
                    saveButtonText={'Save new'}
                    onSave={() => alert('onSave will save in the future')}
                    onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future in the future')}
                    onPostProcessErrorMessage={() => console.log('onPostProcessErrorMessage will be here in the future in the future')}
                />
            }

        </>
    );
};
