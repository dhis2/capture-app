// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { Tag, spacersNum } from '@dhis2/ui';
import { plainStatus, translatedStatus } from '../constants/status.const';

import type { Props } from './status.types';

const styles = {
    status: {
        margin: `0 0 ${spacersNum.dp4}px 0`,
    },
};

export const StatusPlain = ({ status = '', classes }: Props) => (
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

export const Status: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    styles,
)(StatusPlain);
