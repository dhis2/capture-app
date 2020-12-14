// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper/Paper';
import { withStyles } from '@material-ui/core';
import type { OwnProps } from './RegistrationDataEntry.types';
import { EnrollmentRegistrationEntry, TeiRegistrationEntry, SingleEventRegistrationEntry } from '../../../DataEntries';
import { scopeTypes } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../../../DataEntries/common/useRegistrationFormInfoForSelectedScope';
import { InfoIconText } from '../../../InfoIconText';
import { useCurrentOrgUnitInfo } from '../../../../hooks/useCurrentOrgUnitInfo';
import { useScopeTitleText } from '../../../../hooks/useScopeTitleText';
import { TrackedEntityTypeSelector } from '../../../TrackedEntityTypeSelector';


const translatedTextWithStylesForProgram = (trackedEntityName: string, programName: string, orgUnitName: string) =>
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

const getStyles = ({ typography }) => ({
    paper: {
        marginBottom: typography.pxToRem(10),
        padding: typography.pxToRem(10),
    },
    title: {
        padding: '8px 0 0px 8px',
        fontWeight: 500,
    },
    tetypeContainer: {
        marginTop: typography.pxToRem(16),
    },
    registrationContainer: {
        marginLeft: typography.pxToRem(8),
        marginRight: typography.pxToRem(8),
    },
});


const RegistrationDataEntryPlain = ({ setScopeId, classes, selectedScopeId, dataEntryId, onSave }: OwnProps) => {
    const { scopeType, trackedEntityName, programName } = useScopeInfo(selectedScopeId);
    const { registrationMetaData } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();
    const titleText = useScopeTitleText(selectedScopeId);

    const handleRegistrationScopeSelection = (id) => {
        setScopeId(id);
    };

    return (
        <>
            {
                !scopeType &&
                <Paper className={classes.paper}>
                    <div className={classes.title} >
                        New
                    </div>
                    <div className={classes.tetypeContainer}>
                        <TrackedEntityTypeSelector onSelect={handleRegistrationScopeSelection} />
                    </div>
                </Paper>
            }

            {
                scopeType === scopeTypes.TRACKER_PROGRAM &&
                <Paper className={classes.paper}>
                    <div className={classes.title} >
                        New {titleText}
                    </div>

                    <div className={classes.registrationContainer}>
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
                    </div>
                </Paper>
            }

            {
                scopeType === scopeTypes.TRACKED_ENTITY_TYPE &&
                <Paper className={classes.paper}>
                    <div className={classes.title} >
                        New {titleText}
                    </div>

                    <div className={classes.tetypeContainer}>
                        <TrackedEntityTypeSelector onSelect={handleRegistrationScopeSelection} />
                    </div>
                    <div className={classes.registrationContainer}>

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
                    </div>
                </Paper>
            }

            {
                scopeType === scopeTypes.EVENT_PROGRAM &&
                <SingleEventRegistrationEntry
                    id="singleEvent"
                />
            }

        </>
    );
};

export const RegistrationDataEntryComponent = withStyles(getStyles)(RegistrationDataEntryPlain);
