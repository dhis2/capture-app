// @flow
import React, { type ComponentType, useContext, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { Grid, Paper, withStyles } from '@material-ui/core';
import type { Props } from './RegistrationDataEntry.types';
import { EnrollmentRegistrationEntry, TeiRegistrationEntry, SingleEventRegistrationEntry } from '../../../DataEntries';
import { scopeTypes } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../../../DataEntries/common/useRegistrationFormInfoForSelectedScope';
import { useScopeTitleText } from '../../../../hooks/useScopeTitleText';
import { TrackedEntityTypeSelector } from '../../../TrackedEntityTypeSelector';
import { DataEntryWidgetOutput } from '../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { PossibleDuplicatesDialog } from '../../../PossibleDuplicatesDialog/PossibleDuplicatesDialog.component';
import { usePossibleDuplicatesExist } from '../../../PossibleDuplicatesDialog/usePossibleDuplicatesExist';
import { ResultsPageSizeContext } from '../../shared-contexts';

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
    marginTop: {
        marginTop: typography.pxToRem(20),
    },
});

const DialogButtons = ({ onCancel, onSave }) => (<>
    <Button onClick={onCancel} secondary>
        {i18n.t('Cancel')}
    </Button>
    {
        onSave &&
        <div style={{ marginLeft: 8 }}>
            <Button
                dataTest="dhis2-capture-create-as-new-person"
                onClick={onSave}
                primary
            >
                {i18n.t('Save as new')}
            </Button>
        </div>
    }
</>);

const useHandleSaveAttempt = (dataEntryId, onReviewDuplicates) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    const [modalIsOpen, toggleDuplicatesModal] = useState(false);

    const possibleDuplicatesExist = usePossibleDuplicatesExist(dataEntryId);
    const handleSaveAttempt = (onSave) => {
        if (possibleDuplicatesExist) {
            onReviewDuplicates(resultsPageSize);

            toggleDuplicatesModal(true);
        } else {
            onSave();
        }
    };
    const closeModal = () => {
        toggleDuplicatesModal(false);
    };

    return {
        closeModal,
        handleSaveAttempt,
        modalIsOpen,
    };
};

const RegistrationDataEntryPlain = (
    {
        classes,
        setScopeId,
        selectedScopeId,
        dataEntryId,
        onSaveWithoutEnrollment,
        onSaveWithEnrollment,
        onReviewDuplicates,
        dataEntryIsReady,
    }: Props) => {
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { registrationMetaData } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const titleText = useScopeTitleText(selectedScopeId);

    const handleRegistrationScopeSelection = (id) => {
        setScopeId(id);
    };

    const { closeModal, handleSaveAttempt, modalIsOpen } = useHandleSaveAttempt(dataEntryId, onReviewDuplicates);
    return (
        <>
            {
                !scopeType &&
                <Paper className={classes.paper}>
                    <div className={classes.title} >
                        New
                    </div>
                    <div className={classes.tetypeContainer}>
                        <TrackedEntityTypeSelector
                            onSelect={handleRegistrationScopeSelection}
                            headerText={i18n.t('Create for')}
                            footerText={i18n.t('You can also choose a program from the top bar and create in that program')}
                            accessNeeded="write"
                        />
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
                        <Grid container justify="space-between">
                            <Grid item md sm={9} xs={9} >
                                <EnrollmentRegistrationEntry
                                    id={dataEntryId}
                                    selectedScopeId={selectedScopeId}
                                    enrollmentMetadata={registrationMetaData}
                                    saveButtonText={'Save new'}
                                    onSave={() => handleSaveAttempt(onSaveWithEnrollment)}
                                    onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future in the future')}
                                    onPostProcessErrorMessage={() => console.log('onPostProcessErrorMessage will be here in the future in the future')}
                                    onUpdateField={() => console.log('onUpdateField will be here in the future in the future')}
                                    onStartAsyncUpdateField={() => console.log('onStartAsyncUpdateField will be here in the future in the future')}
                                />
                            </Grid>
                            {
                                dataEntryIsReady &&
                                <Grid item>
                                    <div className={classes.marginTop}>
                                        <DataEntryWidgetOutput
                                            selectedScopeId={selectedScopeId}
                                            dataEntryId={dataEntryId}
                                        />
                                    </div>

                                    <PossibleDuplicatesDialog
                                        dataEntryId={dataEntryId}
                                        selectedScopeId={selectedScopeId}
                                        open={modalIsOpen}
                                        onCancel={closeModal}
                                        extraActions={
                                            <DialogButtons
                                                onCancel={closeModal}
                                                onSave={onSaveWithEnrollment}
                                            />
                                        }
                                    />
                                </Grid>
                            }
                        </Grid>
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
                        <TrackedEntityTypeSelector
                            onSelect={handleRegistrationScopeSelection}
                            headerText={i18n.t('Create for')}
                            footerText={i18n.t('You can also choose a program from the top bar and create in that program')}
                            accessNeeded="write"
                        />
                    </div>
                    <div className={classes.registrationContainer}>
                        <Grid container justify="space-between">
                            <Grid item md sm={9} xs={9} >
                                <TeiRegistrationEntry
                                    id={dataEntryId}
                                    selectedScopeId={selectedScopeId}
                                    teiRegistrationMetadata={registrationMetaData}
                                    saveButtonText={'Save new'}
                                    onSave={() => handleSaveAttempt(onSaveWithoutEnrollment)}
                                    onGetUnsavedAttributeValues={() => console.log('onGetUnsavedAttributeValues will be here in the future in the future')}
                                    onPostProcessErrorMessage={() => console.log('onPostProcessErrorMessage will be here in the future in the future')}
                                />
                            </Grid>
                            {
                                dataEntryIsReady &&
                                <Grid item>
                                    <div className={classes.marginTop}>
                                        <DataEntryWidgetOutput
                                            dataEntryId={dataEntryId}
                                            selectedScopeId={selectedScopeId}
                                        />
                                    </div>

                                    <PossibleDuplicatesDialog
                                        dataEntryId={dataEntryId}
                                        selectedScopeId={selectedScopeId}
                                        open={modalIsOpen}
                                        onCancel={closeModal}
                                        extraActions={
                                            <DialogButtons
                                                onCancel={closeModal}
                                                onSave={onSaveWithoutEnrollment}
                                            />
                                        }
                                    />
                                </Grid>
                            }
                        </Grid>
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

export const RegistrationDataEntryComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(RegistrationDataEntryPlain);
