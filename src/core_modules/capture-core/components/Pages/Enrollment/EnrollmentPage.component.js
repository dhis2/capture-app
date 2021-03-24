// @flow
import React, { useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { LockedSelector } from '../../LockedSelector';
import type { Props } from './EnrollmentPage.types';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import LoadingMaskForPage from '../../LoadingMasks/LoadingMaskForPage.component';
import { withErrorMessageHandler } from '../../../HOC';
import { MissingMessage } from './MissingMessage.component';
import { SingleLockedSelect } from '../../LockedSelector/QuickSelector/SingleLockedSelect/SingleLockedSelect.component';
import { useUrlQueries } from '../../LockedSelector/LockedSelector.container';
import { getScopeInfo } from '../../../metaData/helpers';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import { resetEnrollmentSelection, resetTeiSelection, setEnrollmentSelection } from '../../LockedSelector/LockedSelector.actions';

const buildEnrollmentsAsOptions =
  (enrollments = [], selectedProgramId): Array<{|label: string, value: any, |}> =>
      enrollments
          .filter(({ program }) => program === selectedProgramId)
          .map(({ created, enrollment }) => (
              {
                  // $FlowFixMe
                  label: convertValue(created, dataElementTypes.DATETIME),
                  value: enrollment,
              }
          ));


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

const Extras = ({ width, classes }) => {
    const dispatch = useDispatch();
    const { selectedProgramId, selectedEnrollmentId } = useUrlQueries();
    const { enrollments, teiDisplayName, tetId } = useSelector(({ enrollmentPage }) => enrollmentPage);
    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollments, selectedProgramId);
    const { trackedEntityName } = getScopeInfo(tetId);
    const enrollmentLockedSelectReady = Array.isArray(enrollments);

    const onTeiSelectionReset = useCallback(
        () => {
            dispatch(resetTeiSelection());
        },
        [dispatch]);

    const onEnrollmentSelectionSet = useCallback(
        (enrollmentId) => {
            dispatch(setEnrollmentSelection({ enrollmentId }));
        },
        [dispatch]);

    const onEnrollmentSelectionReset = useCallback(
        () => {
            dispatch(resetEnrollmentSelection());
        },
        [dispatch]);

    return (<>
        <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
            <SingleLockedSelect
                ready={enrollmentLockedSelectReady}
                onClear={onTeiSelectionReset}
                options={[{
                    label: teiDisplayName,
                    value: 'alwaysPreselected',

                }]}
                selectedValue="alwaysPreselected"
                title={trackedEntityName}
            />
        </Grid>
        {
            enrollmentsAsOptions &&
            <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={classes.orgUnitSelector}>
                <SingleLockedSelect
                    onClear={onEnrollmentSelectionReset}
                    ready={enrollmentLockedSelectReady}
                    onSelect={onEnrollmentSelectionSet}
                    options={enrollmentsAsOptions}
                    selectedValue={selectedEnrollmentId}
                    title={i18n.t('Enrollment')}
                />
            </Grid>
        }
    </>);
};


const EnrollmentPagePlain = ({ classes, enrollmentPageStatus }) => (<>
    <LockedSelector pageToPush="enrollment" renderExtraSelectors={(width, extraClasses) => <Extras width={width} classes={extraClasses} />} />

    <div data-test="enrollment-page-content" className={classes.container} >

        {
            enrollmentPageStatus === enrollmentPageStatuses.MISSING_SELECTIONS &&
                <MissingMessage />
        }

        {
            enrollmentPageStatus === enrollmentPageStatuses.DEFAULT &&
                <div className={classes.title}>Enrollment Dashboard</div>
        }

        {
            enrollmentPageStatus === enrollmentPageStatuses.LOADING &&
                <div className={classes.loadingMask}>
                    <LoadingMaskForPage />
                </div>
        }
    </div>
</>);

export const EnrollmentPageComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(EnrollmentPagePlain);
