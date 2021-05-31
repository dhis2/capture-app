// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentEventPage.types';
import { pageMode } from './EnrollmentEventPage.const';

const styles = ({ typography }) => ({
    title: {
        ...typography.title,
    },
});

const EnrollmentEventPagePain = ({ mode, classes }) => (
    <>
        <div className={classes.title}>
            {mode === pageMode.VIEW
                ? i18n.t('Enrollment{{escape}} View Event', {
                    escape: ':',
                })
                : i18n.t('Enrollment{{escape}} Edit Event', {
                    escape: ':',
                })}
        </div>
    </>
);

export const EnrollmentEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentEventPagePain);
