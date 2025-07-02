import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Props } from './EnrollmentAddEventPageDefault.types';
import { EnrollmentPageLayout } from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import {
    EnrollmentPageKeys,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';

const styles = {
    container: {
        padding: spacersNum.dp16,
    },
    content: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
};

const EnrollmentAddEventPagePlain = ({
    program,
    stageId,
    orgUnitId,
    teiId,
    enrollmentId,
    onSave,
    dataEntryHasChanges,
    userInteractionInProgress,
    onBackToMainPage,
    onBackToDashboard,
    onCancel,
    onDelete,
    onAddNew,
    onEnrollmentError,
    onAccessLostFromTransfer,
    onEnrollmentSuccess,
    widgetEffects,
    hideWidgets,
    rulesExecutionDependencies,
    pageFailure,
    ready,
    widgetReducerName,
    events,
    onUpdateEnrollmentStatus,
    onUpdateEnrollmentStatusSuccess,
    onUpdateEnrollmentStatusError,
    pageLayout,
    availableWidgets,
    onDeleteTrackedEntitySuccess,
    classes,
    ...passOnProps
}: Props & WithStyles<typeof styles>) => {
    if (pageFailure) {
        return (
            <div>
                {String(i18n.t('There was an error loading the page'))}
            </div>
        );
    }

    if (!ready) {
        return (
            <div className={classes.container}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <EnrollmentPageLayout
                    pageKey={EnrollmentPageKeys.NEW_EVENT}
                    program={program}
                    stageId={stageId}
                    orgUnitId={orgUnitId}
                    teiId={teiId}
                    enrollmentId={enrollmentId}
                    onSave={onSave}
                    dataEntryHasChanges={dataEntryHasChanges}
                    userInteractionInProgress={userInteractionInProgress}
                    onBackToMainPage={onBackToMainPage}
                    onBackToDashboard={onBackToDashboard}
                    onCancel={onCancel}
                    onDelete={onDelete}
                    onAddNew={onAddNew}
                    onEnrollmentError={onEnrollmentError}
                    onAccessLostFromTransfer={onAccessLostFromTransfer}
                    onEnrollmentSuccess={onEnrollmentSuccess}
                    widgetEffects={widgetEffects}
                    hideWidgets={hideWidgets}
                    rulesExecutionDependencies={rulesExecutionDependencies}
                    widgetReducerName={widgetReducerName}
                    events={events}
                    onUpdateEnrollmentStatus={onUpdateEnrollmentStatus}
                    onUpdateEnrollmentStatusSuccess={onUpdateEnrollmentStatusSuccess}
                    onUpdateEnrollmentStatusError={onUpdateEnrollmentStatusError}
                    pageLayout={pageLayout}
                    availableWidgets={availableWidgets}
                    onDeleteTrackedEntitySuccess={onDeleteTrackedEntitySuccess}
                    {...passOnProps}
                />
            </div>
        </div>
    );
};

export const EnrollmentAddEventPageDefaultComponent = withStyles(styles)(EnrollmentAddEventPagePlain) as ComponentType<Props>;
