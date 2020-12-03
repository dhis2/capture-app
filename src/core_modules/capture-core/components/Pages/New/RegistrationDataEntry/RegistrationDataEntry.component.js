// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { OwnProps } from './RegistrationDataEntry.types';
import { EnrollmentRegistrationEntry, TeiRegistrationEntry } from '../../../DataEntries';
import { scopeTypes } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../../../DataEntries/common/useRegistrationFormInfoForSelectedScope';
import { InfoIconText } from '../../../InfoIconText';
import { useCurrentOrgUnitInfo } from '../../../../hooks/useCurrentOrgUnitInfo';


const translatedTextWithStylesForProgram = (trackedEntityName, programName, orgUnitName) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}} in', { trackedEntityName })} <b>{programName}</b>
        {orgUnitName && <>{' '}{i18n.t('in')} <b>{orgUnitName}</b></>}.
    </>);


const translatedTextWithStylesForTei = (trackedEntityName, orgUnitName) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}}', { trackedEntityName })} <b>{i18n.t('without')}</b> {i18n.t('enrollment')}
        {orgUnitName && <>{' '}{i18n.t('in')} <b>{orgUnitName}</b></>}.{' '}
        {i18n.t('Enroll in a program by selecting a program from the top bar.')}
    </>);


export const RegistrationDataEntry = ({ selectedScopeId, dataEntryId }: OwnProps) => {
    const { scopeType, trackedEntityName, programName } = useScopeInfo(selectedScopeId);
    const { registrationMetaData } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();


const translatedTextWithStylesForTei = (trackedEntityName, orgUnitName) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}}', { trackedEntityName })} <b>{i18n.t('without')}</b> {i18n.t('enrollment in')} <b>{orgUnitName}</b>. {i18n.t('Enroll in a program by selecting a program from the top bar.')}
    </>);


export const RegistrationDataEntryComponent = ({ selectedScopeId, dataEntryId, onSave }: OwnProps) => {
    const { scopeType, trackedEntityName, programName } = useScopeInfo(selectedScopeId);
    const { registrationMetaData } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();

    return (
        <>
            {
                scopeType === scopeTypes.TRACKER_PROGRAM &&
                <>
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
                    <InfoIconText
                        text={translatedTextWithStylesForProgram(trackedEntityName.toLowerCase(), programName, orgUnit.name)}
                    />

                </>
            }

            {
                scopeType === scopeTypes.TRACKED_ENTITY_TYPE &&
                <>
                    <TeiRegistrationEntry
                        id={dataEntryId}
                        selectedScopeId={selectedScopeId}
                        teiRegistrationMetadata={registrationMetaData}
                        saveButtonText={'Save new'}
                        onSave={onSave}
                        onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future in the future')}
                        onPostProcessErrorMessage={() => console.log('onPostProcessErrorMessage will be here in the future in the future')}
                    />
                    <InfoIconText
                        text={translatedTextWithStylesForTei(trackedEntityName.toLowerCase(), orgUnit.name)}
                    />
                </>
            }

        </>
    );
};
