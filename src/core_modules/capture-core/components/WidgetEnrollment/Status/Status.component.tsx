import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Tag, spacersNum } from '@dhis2/ui';
import { plainStatus, translatedStatus } from '../constants/status.const';
import type { Props } from './status.types';

const styles = {
    status: {
        margin: `0 0 ${spacersNum.dp4}px 0`,
    },
};

export const StatusPlain = ({ status = '', classes }: Props & WithStyles<typeof styles>) => (
    <Tag
        className={classes.status}
        neutral={status === plainStatus.ACTIVE}
        negative={status === plainStatus.CANCELLED}
    >
        {translatedStatus[status] ?? status}
    </Tag>
);

export const Status = withStyles(styles)(StatusPlain);
