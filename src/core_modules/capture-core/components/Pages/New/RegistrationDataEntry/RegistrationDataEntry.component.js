// @flow
import React, { type ComponentType, useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, spacers } from '@dhis2/ui';
import { Grid, withStyles } from '@material-ui/core';
import type { Props } from './RegistrationDataEntry.types';
import { TeiRegistrationEntry, SingleEventRegistrationEntry } from '../../../DataEntries';
import { scopeTypes } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useScopeTitleText } from '../../../../hooks/useScopeTitleText';
import { TrackedEntityTypeSelector } from '../../../TrackedEntityTypeSelector';
import { DataEntryWidgetOutput } from '../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { ResultsPageSizeContext } from '../../shared-contexts';
import { navigateToEnrollmentOverview } from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { EnrollmentRegistrationEntryWrapper } from '../EnrollmentRegistrationEntryWrapper.component';
import { useCurrentOrgUnitId } from '../../../../hooks/useCurrentOrgUnitId';

const getStyles = ({ typography }) => ({
    container: {
        marginBottom: spacers.dp12,
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
    title: {
        padding: '8px 0 0px 8px',
        fontWeight: 500,
        marginBottom: spacers.dp16,
    },
    tetypeContainer: {
        marginTop: typography.pxToRem(16),
    },
    registrationContainer: {
        marginLeft: typography.pxToRem(8),
        marginRight: typography.pxToRem(8),
    },
    marginBottom: {
        marginBottom: spacers.dp16,
    },
});

const DialogButtons = ({ onCancel, onSave }) => (
    <>
        <Button onClick={onCancel} secondary>
            {i18n.t('Cancel')}
        </Button>
        {
            onSave &&
            <div style={{ marginLeft: 8 }}>
                <Button
                    dataTest="create-as-new-person"
                    onClick={onSave}
                    primary
                >
                    {i18n.t('Save as new')}
                </Button>
            </div>
        }
    </>
);

const CardListButton = (({ teiId, orgUnitId }) => {
    const dispatch = useDispatch();
    const { programId } = useLocationQuery();

    return (
        <Button
            small
            dataTest="view-dashboard-button"
            onClick={() => dispatch(navigateToEnrollmentOverview({
                teiId,
                orgUnitId,
                programId,
            }))
            }
        >
            {i18n.t('View dashboard')}
        </Button>
    );
});

const RegistrationDataEntryPlain = ({
    classes,
    setScopeId,
    selectedScopeId,
    dataEntryId,
    onSaveWithoutEnrollment,
    onSaveWithEnrollment,
    dataEntryIsReady,
    teiId,
    trackedEntityInstanceAttributes,
}: Props) => {
    const { push } = useHistory();
    const { resultsPageSize } = useContext(ResultsPageSizeContext);
    const { scopeType, programName, trackedEntityName } = useScopeInfo(selectedScopeId);
    const titleText = useScopeTitleText(selectedScopeId);
    const currentOrgUnitId = useCurrentOrgUnitId();

    const onCancel = useCallback(() => {
        let url;
        if (scopeType === scopeTypes.TRACKER_PROGRAM) {
            url = buildUrlQueryString({ programId: selectedScopeId, orgUnitId: currentOrgUnitId });
        } else {
            url = buildUrlQueryString({ orgUnitId: currentOrgUnitId });
        }
        return push(`/?${url}`);
    }, [currentOrgUnitId, push, scopeType, selectedScopeId]);

    const handleRegistrationScopeSelection = (id) => {
        setScopeId(id);
    };

    const renderDuplicatesDialogActions = useCallback((callbackOnCancel, onSave) => (
        <DialogButtons
            onCancel={callbackOnCancel}
            onSave={onSave}
        />
    ), []);

    const renderDuplicatesCardActions = useCallback(({ item }) => (
        <CardListButton
            teiId={item.id}
            orgUnitId={item.tei.orgUnit}
        />
    ), []);

    const ExistingUniqueValueDialogActions = useCallback(({ teiId: existingTeiId }) => {
        const dispatch = useDispatch(); // eslint-disable-line react-hooks/rules-of-hooks -- This is valid because the callback here is a React component
        const { programId, orgUnitId } = useLocationQuery(); // eslint-disable-line react-hooks/rules-of-hooks -- This is valid because the callback here is a React component

        return (
            <Button
                dataTest="existing-unique-value-link-tei-button"
                primary
                onClick={() => dispatch(navigateToEnrollmentOverview({
                    teiId: existingTeiId,
                    orgUnitId,
                    programId,
                }))}
            >
                {programId ? i18n.t('View enrollment') : i18n.t('View dashboard')}
            </Button>
        );
    }, []);

    return (
        <>
            {
                !scopeType &&
                <div className={classes.container}>
                    <div className={classes.title} >
                        {i18n.t('New')}
                    </div>
                    <div className={classes.tetypeContainer}>
                        <TrackedEntityTypeSelector
                            onSelect={handleRegistrationScopeSelection}
                            headerText={i18n.t('Create for')}
                            footerText={i18n.t('You can also choose a program from the top bar and create in that program')}
                            accessNeeded="write"
                        />
                    </div>
                </div>
            }

            {
                scopeType === scopeTypes.TRACKER_PROGRAM &&
                <div className={classes.container}>
                    <div className={classes.title} >
                        {
                            teiId ? i18n.t('New Enrollment in program{{escape}} {{programName}}', {
                                escape: ':',
                                programName,
                                interpolation: { escapeValue: false },
                            }) : i18n.t('New {{titleText}}', {
                                titleText,
                                interpolation: { escapeValue: false },
                            })
                        }
                    </div>

                    <div className={classes.registrationContainer}>
                        <Grid container justify="space-between">
                            <Grid item md sm={9} xs={9} >
                                <EnrollmentRegistrationEntryWrapper
                                    id={dataEntryId}
                                    orgUnitId={currentOrgUnitId}
                                    teiId={teiId}
                                    selectedScopeId={selectedScopeId}
                                    onSave={onSaveWithEnrollment}
                                    onCancel={onCancel}
                                    saveButtonText={(trackedEntityTypeNameLC: string) => i18n.t('Save {{trackedEntityTypeName}}', {
                                        trackedEntityTypeName: trackedEntityTypeNameLC,
                                        interpolation: { escapeValue: false },
                                    })}
                                    duplicatesReviewPageSize={resultsPageSize}
                                    renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                                    renderDuplicatesCardActions={renderDuplicatesCardActions}
                                    ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
                                    trackedEntityInstanceAttributes={trackedEntityInstanceAttributes}
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
                                </Grid>
                            }
                        </Grid>
                    </div>
                </div>
            }

            {
                scopeType === scopeTypes.TRACKED_ENTITY_TYPE &&
                <div className={classes.container}>
                    <div className={classes.title} >
                        {i18n.t('New {{titleText}}', {
                            titleText,
                            interpolation: { escapeValue: false },
                        })}
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
                                    orgUnitId={currentOrgUnitId}
                                    onCancel={onCancel}
                                    saveButtonText={i18n.t('Save {{trackedEntityName}}', {
                                        trackedEntityName,
                                        interpolation: { escapeValue: false },
                                    })}
                                    onSave={onSaveWithoutEnrollment}
                                    duplicatesReviewPageSize={resultsPageSize}
                                    renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                                    renderDuplicatesCardActions={renderDuplicatesCardActions}
                                    ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
                                />
                            </Grid>
                            {
                                dataEntryIsReady &&
                                <Grid item>
                                    <div className={classes.marginBottom}>
                                        <DataEntryWidgetOutput
                                            selectedScopeId={selectedScopeId}
                                            dataEntryId={dataEntryId}
                                        />
                                    </div>
                                </Grid>
                            }
                        </Grid>
                    </div>
                </div>
            }

            {
                scopeType === scopeTypes.EVENT_PROGRAM && (
                    <SingleEventRegistrationEntry
                        id="singleEvent"
                        selectedScopeId={selectedScopeId}
                    />
                )
            }

        </>
    );
};

export const RegistrationDataEntryComponent: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(RegistrationDataEntryPlain);
