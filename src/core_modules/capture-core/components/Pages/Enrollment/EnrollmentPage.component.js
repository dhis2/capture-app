// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import type { Props } from './EnrollmentPage.types';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import { LoadingMaskForPage } from '../../LoadingMasks/LoadingMaskForPage.component';
import { withErrorMessageHandler } from '../../../HOC';
import { MissingMessage } from './MissingMessage.component';
import { EnrollmentPageDefault } from './EnrollmentPageDefault';
import { TopBar } from './TopBar.container';

const getStyles = ({ typography }) => ({
    container: {
        padding: '16px 24px 16px 24px',
    },
    loadingMask: {
        height: '100vh',
    },
    title: {
        ...typography.title,
    },
});

const EnrollmentPagePlain = ({
    classes,
    programId,
    orgUnitId,
    enrollmentId,
    trackedEntityName,
    teiDisplayName,
    enrollmentPageStatus,
    enrollmentsAsOptions,
    selectProgramHandler,
    deselectProgramHandler,
}) => (
    <>
        <TopBar
            orgUnitId={orgUnitId}
            programId={programId}
            trackedEntityName={trackedEntityName}
            teiDisplayName={teiDisplayName}
            enrollmentsAsOptions={enrollmentsAsOptions}
            enrollmentId={enrollmentId}
            selectProgramHandler={selectProgramHandler}
            deselectProgramHandler={deselectProgramHandler}
        />

        <div data-test="enrollment-page-content" className={classes.container}>
            {enrollmentPageStatus === enrollmentPageStatuses.MISSING_SELECTIONS && <MissingMessage selectProgramHandler />}

            {enrollmentPageStatus === enrollmentPageStatuses.DEFAULT && <EnrollmentPageDefault />}

            {enrollmentPageStatus === enrollmentPageStatuses.LOADING && (
                <div className={classes.loadingMask}>
                    <LoadingMaskForPage />
                </div>
            )}
        </div>
    </>
);

export const EnrollmentPageComponent: ComponentType<$Diff<Props, CssClasses>> = compose(
    withErrorMessageHandler(),
    withStyles(getStyles),
)(EnrollmentPagePlain);
