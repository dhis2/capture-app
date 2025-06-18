import React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import { Tag, spacersNum } from '@dhis2/ui';
import { plainStatus, translatedStatus } from '../constants/status.const';

const styles = {
    status: {
        margin: `0 0 ${spacersNum.dp4}px 0`,
    },
};

type OwnProps = {
    status?: string;
};

export const StatusPlain = ({ status = '', classes }: OwnProps & WithStyles<typeof styles>) => (
    <>
        <Tag
            className={classes.status}
            neutral={status === plainStatus.ACTIVE}
            negative={status === plainStatus.CANCELLED}
        >
            {translatedStatus[status] || status}
        </Tag>
    </>
);

export const Status = withStyles(styles)(StatusPlain);
