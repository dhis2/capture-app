// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentAddEventPage.types';
import { WidgetAddEvent } from '../../WidgetAddEvent';
import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
} from '../../ScopeSelector';
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

const EnrollmentAddEventPagePain = ({ programStage, programId, orgUnitId, classes }) => {
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();

    const { resetProgramId } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    return (
        <>
            <ScopeSelector
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                onSetProgramId={id => setProgramId(id)}
                onSetOrgUnit={id => setOrgUnitId(id)}
                onResetProgramId={() => resetProgramId()}
                onResetOrgUnitId={() => resetOrgUnitId()}
            >
                <Grid item xs={12} sm={6} md={6} lg={2}>
                    <TopBarActions
                        selectedProgramId={programId}
                        selectedOrgUnitId={orgUnitId}
                        // isUserInteractionInProgress={blocked by DHIS2-11393 and DHIS2-11399}
                    />
                </Grid>
            </ScopeSelector>
            <div className={classes.container} data-test="add-event-enrollment-page-content">
                <div className={classes.title}>{i18n.t('Enrollment{{escape}} New Event', { escape: ':' })}</div>
                <div>
                    <WidgetAddEvent programStage={programStage} />
                </div>
            </div>
        </>
    );
};

export const EnrollmentAddEventPageComponent: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(EnrollmentAddEventPagePain);
