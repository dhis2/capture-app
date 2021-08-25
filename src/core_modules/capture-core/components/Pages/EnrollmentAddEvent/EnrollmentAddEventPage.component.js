// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentAddEventPage.types';
import { WidgetEnrollmentEventNew } from '../../WidgetEnrollmentEventNew';

const styles = ({ typography }) => ({
    container: {
        padding: '16px 24px 16px 24px',
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentAddEventPagePain = ({
    classes,
    ...passOnProps // needs destructering when introducing scope selector
}: Props) => (
    <div
        className={classes.container}
        data-test="add-event-enrollment-page-content"
    >
        <div className={classes.title}>
            {i18n.t('Enrollment{{escape}} New Event', { escape: ':' })}
        </div>
        <div>
            <WidgetEnrollmentEventNew
                {...passOnProps}
            />
        </div>
    </div>
);

export const EnrollmentAddEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentAddEventPagePain);
