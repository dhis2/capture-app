// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import i18n from '@dhis2/d2-i18n';
import Grid from '@material-ui/core/Grid';
import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useSetEnrollmentId,
    useResetProgramId,
    useResetOrgUnitId,
    useResetTeiId,
    useResetEnrollmentId,
} from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';
import { SingleLockedSelect } from '../../ScopeSelector/QuickSelector/SingleLockedSelect.component';
import type { Props } from './EnrollmentPage.types';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import { LoadingMaskForPage } from '../../LoadingMasks/LoadingMaskForPage.component';
import { withErrorMessageHandler } from '../../../HOC';
import { MissingMessage } from './MissingMessage.component';
import { EnrollmentPageDefault } from './EnrollmentPageDefault';

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
}) => {
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();
    const { setEnrollmentId } = useSetEnrollmentId();

    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetEnrollmentId } = useResetEnrollmentId();
    const { resetTeiId } = useResetTeiId();

    return (
        <>
            <ScopeSelector
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                onSetProgramId={id => setProgramId(id)}
                onSetOrgUnit={id => setOrgUnitId(id)}
                onResetProgramId={() => resetProgramIdAndEnrollmentContext()}
                onResetOrgUnitId={() => resetOrgUnitId()}
            >
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={trackedEntityName && teiDisplayName}
                        onClear={() => resetTeiId('/')}
                        options={[
                            {
                                label: teiDisplayName,
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={trackedEntityName}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready
                        onClear={() => resetEnrollmentId()}
                        onSelect={id => setEnrollmentId({ enrollmentId: id })}
                        options={enrollmentsAsOptions}
                        selectedValue={enrollmentId}
                        title={i18n.t('Enrollment')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                    <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
                </Grid>
            </ScopeSelector>

            <div
                data-test="enrollment-page-content"
                className={classes.container}
            >
                {enrollmentPageStatus ===
                    enrollmentPageStatuses.MISSING_SELECTIONS && (
                    <MissingMessage />
                )}

                {enrollmentPageStatus === enrollmentPageStatuses.DEFAULT && (
                    <EnrollmentPageDefault />
                )}

                {enrollmentPageStatus === enrollmentPageStatuses.LOADING && (
                    <div className={classes.loadingMask}>
                        <LoadingMaskForPage />
                    </div>
                )}
            </div>
        </>
    );
};

export const EnrollmentPageComponent: ComponentType<$Diff<Props, CssClasses>> =
    compose(
        withErrorMessageHandler(),
        withStyles(getStyles),
    )(EnrollmentPagePlain);
