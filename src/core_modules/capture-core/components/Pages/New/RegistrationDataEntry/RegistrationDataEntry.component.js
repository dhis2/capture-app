// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper/Paper';
import { withStyles } from '@material-ui/core';
import type { Props } from './RegistrationDataEntry.types';
import { EnrollmentRegistrationEntry, TeiRegistrationEntry, SingleEventRegistrationEntry } from '../../../DataEntries';
import { scopeTypes } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../../../DataEntries/common/useRegistrationFormInfoForSelectedScope';
import { useCurrentOrgUnitInfo } from '../../../../hooks/useCurrentOrgUnitInfo';
import { useScopeTitleText } from '../../../../hooks/useScopeTitleText';
import { TrackedEntityTypeSelector } from '../../../TrackedEntityTypeSelector';


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

const RegistrationDataEntryPlain = (
    {
        classes,
        setScopeId,
        selectedScopeId,
        dataEntryId,
        onSaveWithoutEnrollment,
        onSaveWithEnrollment,
    }: Props) => {
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { registrationMetaData } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
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
                            onSave={onSaveWithEnrollment}
                            onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future in the future')}
                            onPostProcessErrorMessage={() => console.log('onPostProcessErrorMessage will be here in the future in the future')}
                            onUpdateField={() => console.log('onUpdateField will be here in the future in the future')}
                            onStartAsyncUpdateField={() => console.log('onStartAsyncUpdateField will be here in the future in the future')}
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
                            onSave={onSaveWithoutEnrollment}
                            onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future in the future')}
                            onPostProcessErrorMessage={() => console.log('onPostProcessErrorMessage will be here in the future in the future')}
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
