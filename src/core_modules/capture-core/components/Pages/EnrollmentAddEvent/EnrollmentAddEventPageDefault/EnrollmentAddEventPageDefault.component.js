// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentAddEventPageDefault.types';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';
import { EnrollmentPageLayout } from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import {
    EnrollmentPageKeys,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';

const styles = ({ typography }) => ({
    container: {
        padding: '16px 24px 16px 24px',
    },
    columns: {
        display: 'flex',
    },
    leftColumn: {
        flexGrow: 3,
        flexShrink: 1,
        width: 872,
    },
    rightColumn: {
        flexGrow: 1,
        flexShrink: 1,
        paddingLeft: spacersNum.dp16,
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentAddEventPagePain = ({
    pageLayout,
    availableWidgets,
    program,
    stageId,
    orgUnitId,
    teiId,
    enrollmentId,
    widgetEffects,
    hideWidgets,
    onDelete,
    onAddNew,
    onEnrollmentError,
    onEnrollmentSuccess,
    pageFailure,
    ready,
    onAccessLostFromTransfer,
    classes,
    ...passOnProps
}: Props) => {
    if (pageFailure) {
        return (
            <div>
                {i18n.t('There was an error loading the page')}
            </div>
        );
    }

    if (!orgUnitId) {
        return (
            <IncompleteSelectionsMessage>
                {i18n.t('Choose an organisation unit to start reporting')}
            </IncompleteSelectionsMessage>
        );
    }

    if (!ready) {
        return null;
    }
    return (
        <div>
            <EnrollmentPageLayout
                {...passOnProps}
                currentPage={EnrollmentPageKeys.NEW_EVENT}
                program={program}
                pageLayout={pageLayout}
                stageId={stageId}
                availableWidgets={availableWidgets}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
                widgetEffects={widgetEffects}
                hideWidgets={hideWidgets}
                onDelete={onDelete}
                onAddNew={onAddNew}
                onEnrollmentError={onEnrollmentError}
                onEnrollmentSuccess={onEnrollmentSuccess}
                onAccessLostFromTransfer={onAccessLostFromTransfer}
                feedbackEmptyText={i18n.t('No feedback for this event yet')}
                indicatorEmptyText={i18n.t('No indicator output for this event yet')}
            />
        </div>
    );
};

export const EnrollmentAddEventPageDefaultComponent: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(EnrollmentAddEventPagePain);
