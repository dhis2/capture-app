// @flow
import React, { type ComponentType } from 'react';
import { compose } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid } from '@material-ui/core';
import { LockedSelector } from '../../../../LockedSelector';
import type { Props } from './EnrollmentEventEditPage.types';
import { withErrorMessageHandler } from '../../../../../HOC';
import { SingleLockedSelect } from '../../../../LockedSelector/QuickSelector/SingleLockedSelect/SingleLockedSelect.component';
import { useExtras } from '../../hooks';
import { enrollmentPageStatuses } from '../../EnrollmentPage.constants';
import { enrollmentEventEditPageStatuses } from "./enrollmentEventEditPage.constants";


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
    const {
        onTeiSelectionReset,
        selectedEnrollmentId,
        teiDisplayName,
        enrollmentsAsOptions,
        trackedEntityName,
        enrollmentLockedSelectReady,
        onEnrollmentSelectionSet,
        onEnrollmentSelectionReset,
    } = useExtras();

    return (<>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready
                onClear={onTeiSelectionReset}
                options={[{
                    label: 'name',
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={'trackedEntityName'}
            />
        </Grid>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready
                onClear={onTeiSelectionReset}
                options={[{
                    label: 'name',
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={'trackedEntityName'}
            />
        </Grid>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready
                onClear={onTeiSelectionReset}
                options={[{
                    label: 'name',
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={'trackedEntityName'}
            />
        </Grid>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready
                onClear={onTeiSelectionReset}
                options={[{
                    label: 'name',
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={'trackedEntityName'}
            />
        </Grid>
    </>);
};

const EnrollmentEventEditPagePlain = ({ pageStatus, classes }) => (<>
    <LockedSelector pageToPush="enrollment/event/edit" renderExtraSelectors={(width, extraClasses) => <ExtraSelectors width={width} classes={extraClasses} />} />

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
