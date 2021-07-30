// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { DataTableCell, colors } from '@dhis2/ui';
import cx from 'classnames';
import { ManagementStatuses } from '../WidgetManagement.const';

type Props = {|
    displayName: string,
    reason?: ?string,
    status: string,
    ...CssClasses,
|}

const styles = {
    container: {
    },
    MainTitle: {
        margin: '5px 0',
        overflow: 'hidden',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        '&.subtitle': {
            color: colors.grey600,
        },
    },
};

const ManagementTitlePlain = ({ displayName, reason, status, classes }: Props) => (
    <DataTableCell muted={status !== ManagementStatuses.open}>
        <div className={classes.container}>
            <p className={classes.MainTitle}>{displayName}</p>
            {!(status !== ManagementStatuses.open) && (
                <span className={cx(classes.MainTitle, { subtitle: true })}>{reason}</span>
            )}
        </div>
    </DataTableCell>
);

export const ManagementTitle = withStyles(styles)(ManagementTitlePlain);
