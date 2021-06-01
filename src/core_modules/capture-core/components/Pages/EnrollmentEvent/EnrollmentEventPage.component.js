// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentEventPage.types';
import { pageMode } from './EnrollmentEventPage.const';
import { EventDetails } from '../ViewEvent/EventDetailsSection/EventDetailsSection.container';
import { LoadingMaskElementCenter } from '../../LoadingMasks';

const styles = ({ typography }) => ({
    page: {
        margin: spacersNum.dp16,
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentEventPagePain = ({
    mode,
    programStage,
    eventAccess,
    classes,
}) => (
    <div className={classes.page}>
        <div className={classes.title}>
            {mode === pageMode.VIEW
                ? i18n.t('Enrollment{{escape}} View Event', {
                    escape: ':',
                })
                : i18n.t('Enrollment{{escape}} Edit Event', {
                    escape: ':',
                })}
        </div>
        {programStage ? (
            <EventDetails
                eventAccess={eventAccess}
                programStage={programStage}
                hasName
                hasIcon
            />
        ) : (
            <LoadingMaskElementCenter />
        )}
    </div>
);

export const EnrollmentEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentEventPagePain);
