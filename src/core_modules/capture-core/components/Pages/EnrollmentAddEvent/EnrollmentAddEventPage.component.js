// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentAddEventPage.types';
import {
    ScopeSelector,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    useResetTeiId,
    useResetEnrollmentId,
    useResetStageId,
    useResetEventId,
} from '../../ScopeSelector';
import { SingleLockedSelect } from '../../ScopeSelector/QuickSelector/SingleLockedSelect.component';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { pageStatuses } from './EnrollmentAddEventPage.constants';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import { WidgetEnrollmentEventNew } from '../../WidgetEnrollmentEventNew';
import { TopBarActions } from '../../TopBarActions';

const styles = ({ typography }) => ({
    container: {
        padding: '16px 24px 16px 24px',
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentAddEventPagePain = ({
    programStage,
    stageId,
    programId,
    orgUnitId,
    enrollmentId,
    enrollmentsAsOptions,
    trackedEntityName,
    teiDisplayName,
    classes,
    teiId,
    pageStatus,
}) => {
    const { setOrgUnitId } = useSetOrgUnitId();
    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetEnrollmentId } = useResetEnrollmentId();
    const { resetTeiId } = useResetTeiId();
    const { resetStageId } = useResetStageId();
    const { resetEventId } = useResetEventId();
    const isUserInteractionInProgress = useSelector(state => dataEntryHasChanges(state, 'enrollmentEvent-newEvent'));

    return (
        <>
            <ScopeSelector
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                onSetOrgUnit={id => setOrgUnitId(id)}
                onResetProgramId={() => resetProgramIdAndEnrollmentContext('enrollment')}
                onResetOrgUnitId={() => resetOrgUnitId()}
                isUserInteractionInProgress={isUserInteractionInProgress}>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={pageStatus !== pageStatuses.MISSING_DATA}
                        onClear={() => resetTeiId('/')}
                        options={[
                            {
                                label: teiDisplayName,
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={trackedEntityName}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={pageStatus !== pageStatuses.MISSING_DATA}
                        onClear={() => resetEnrollmentId('enrollment')}
                        options={enrollmentsAsOptions}
                        selectedValue={enrollmentId}
                        title={i18n.t('Enrollment')}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={pageStatus !== pageStatuses.MISSING_DATA}
                        onClear={() => resetStageId('enrollment')}
                        options={[
                            {
                                label: programStage?.name || '',
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={i18n.t('stage')}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={pageStatus !== pageStatuses.MISSING_DATA}
                        onClear={() => resetEventId('enrollment')}
                        options={[
                            {
                                label: '-',
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={programStage.stageForm.getLabel('eventDate')}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                    <TopBarActions
                        selectedProgramId={programId}
                        selectedOrgUnitId={orgUnitId}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
            </ScopeSelector>
            <div className={classes.container} data-test="add-event-enrollment-page-content">
                <div className={classes.title}>{i18n.t('Enrollment{{escape}} New Event', { escape: ':' })}</div>
                <div>
                    {pageStatus === pageStatuses.DEFAULT && (
                        <WidgetEnrollmentEventNew
                            enrollmentId={enrollmentId}
                            orgUnitId={orgUnitId}
                            programId={programId}
                            stageId={stageId}
                            teiId={teiId}
                        />
                    )}
                    {pageStatus === pageStatuses.MISSING_DATA && (
                        <span>{i18n.t('The enrollment event data could not be found')}</span>
                    )}
                    {pageStatus === pageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
                        <IncompleteSelectionsMessage>
                            {i18n.t('Choose a registering unit to start reporting')}
                        </IncompleteSelectionsMessage>
                    )}
                </div>
            </div>
        </>
    );
};

export const EnrollmentAddEventPageComponent: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(EnrollmentAddEventPagePain);
