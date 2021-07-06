// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentAddEventPage.types';

const styles = ({ typography }) => ({
    container: {
        padding: '16px 24px 16px 24px',
    },
    page: {
        margin: spacersNum.dp16,
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentAddEventPagePain = ({
    classes,
}) => (
    <div className={classes.container}>

        <div className={classes.title}>
            {i18n.t('Enrollment{{escape}} New Event', { escape: ':' })}
        </div>
        <div className={classes.columns} />

    </div>
);

export const EnrollmentAddEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentAddEventPagePain);
