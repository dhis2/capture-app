// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { compose } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { LockedSelector } from '../../../../LockedSelector';
import type { Props } from './EnrollmentEventEditPage.types';
import { withErrorMessageHandler } from '../../../../../HOC';
import { SingleLockedSelect } from '../../../../LockedSelector/QuickSelector/SingleLockedSelect/SingleLockedSelect.component';
import { enrollmentEventEditPageStatuses } from './enrollmentEventEditPage.constants';
import { urlArguments } from '../../../../../utils/url';


const styles = ({ typography }) => ({
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


const ExtraSelectors = ({ width, classes }) => {
    const { push } = useHistory();

    const {
        teiId,
        programId,
        orgUnitId,
        enrollmentId,
    } = useSelector(({ router: { location: { query } } }) => query);

    const {
        teiDisplayName,
        tetDisplayName,
        enrollmentDisplayDate,
        enrollmentDisplayName,
        programStageDisplayName,
        eventDisplayDate,
    } = useSelector(({ enrollmentEventEditPage }) => enrollmentEventEditPage);

    const resetTei = () => push({
        pathname: '/',
        search: `?${urlArguments({ programId, orgUnitId })}`,
        state: { automaticUrlCompletion: false },
    });
    const resetEnrollment = () => push({
        pathname: '/enrollment',
        search: `?${urlArguments({ programId, orgUnitId, teiId })}`,
        state: { automaticUrlCompletion: false },
    });
    const resetStage = () => push({
        pathname: '/enrollment',
        search: `?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`,
        state: { automaticUrlCompletion: false },
    });
    const resetEvent = () => push({
        pathname: '/enrollment',
        search: `?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`,
        state: { automaticUrlCompletion: false },
    });

    return (<>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready={Boolean(teiDisplayName)}
                onClear={resetTei}
                options={[{
                    label: teiDisplayName,
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={tetDisplayName}
            />
        </Grid>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready={Boolean(enrollmentDisplayDate)}
                onClear={resetEnrollment}
                options={[{
                    label: enrollmentDisplayDate,
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={enrollmentDisplayName}
            />
        </Grid>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready={Boolean(programStageDisplayName)}
                onClear={resetStage}
                options={[{
                    label: programStageDisplayName,
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={i18n.t('Stage')}
            />
        </Grid>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready={Boolean(eventDisplayDate)}
                onClear={resetEvent}
                options={[{
                    label: eventDisplayDate,
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={i18n.t('Event')}
            />
        </Grid>
    </>);
};

const EnrollmentEventEditPagePlain = ({ pageStatus, classes }) => (<>
    <LockedSelector pageToPush="enrollment" renderExtraSelectors={(width, extraClasses) => <ExtraSelectors width={width} classes={extraClasses} />} />

    <div data-test="enrollment-event-edit-page-content" className={classes.container} >

        {
            pageStatus === enrollmentEventEditPageStatuses.DEFAULT &&
            <div className={classes.title}>Enrollment: Edit Event</div>
        }
    </div>
</>
);

export const EnrollmentEventEditPageComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(styles),
  )(EnrollmentEventEditPagePlain);
