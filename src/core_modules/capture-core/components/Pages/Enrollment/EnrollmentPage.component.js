// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { LockedSelector } from '../../LockedSelector';
import type { Props } from './EnrollmentPage.types';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import { LoadingMaskForPage } from '../../LoadingMasks';

const getStyles = () => ({
    container: {
        padding: '8px 24px 16px 24px',
    },
});

const EnrollmentPagePlain = ({ classes, enrollmentPageStatus }) => (<>
    {
        enrollmentPageStatus === enrollmentPageStatuses.LOADING ?
            <LoadingMaskForPage />
            :
            <>
                <LockedSelector />

                <div data-test="dhis2-capture-enrollment-page-content" className={classes.container} >

                    {
                        enrollmentPageStatus === enrollmentPageStatuses.DEFAULT &&
                        <div>default</div>
                    }


                    {
                        enrollmentPageStatus === enrollmentPageStatuses.ERROR &&
                        <div>
                            error
                        </div>
                    }
                </div>
            </>
    }
</>);

export const EnrollmentPageComponent: ComponentType<$Diff<Props, CssClasses>> =
  withStyles(getStyles)(EnrollmentPagePlain);
