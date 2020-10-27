// @flow
import i18n from '@dhis2/d2-i18n';
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import { EventWorkingLists } from '../../EventWorkingLists';
import type { Props } from './workingListsInitHeader.types';

const getStyles = (theme: Theme) => ({
    headerContainer: {
        padding: theme.typography.pxToRem(24),
        borderColor: theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.8),
        borderWidth: '0 0 1px 0',
        borderStyle: 'solid',
    },
    listContainer: {
        padding: theme.typography.pxToRem(24),
    },
    title: {
        ...theme.typography.title,
    },
});

const WorkingListsInitHeaderPlain =
    ({ classes: { headerContainer, listContainer, title }, ...passOnProps }: Props & CssClasses) => (
        <Paper>
            <div
                className={headerContainer}
            >
                <span
                    className={title}
                >
                    {i18n.t('Registered events')}
                </span>
            </div>
            <div
                className={listContainer}
            >
                <EventWorkingLists
                    {...passOnProps}
                />
            </div>
        </Paper>
    );

export const WorkingListsInitHeader: ComponentType<Props> = withStyles(getStyles)(WorkingListsInitHeaderPlain);
