// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors, spacersNum } from '@dhis2/ui';
import type { Props } from './stageOverview.types';

const styles = {
    container: {
        padding: spacersNum.dp8,
        backgroundColor: colors.grey200,
    },
    title: {
        fontSize: 18,
        lineHeight: 1.556,
        fontWeight: 500,
        color: colors.grey900,
    },
};
export const StageOverviewPlain = ({ title, classes }: Props) => (
    <div
        className={classes.container}
    >
        <div className={classes.title}>
            {title}
        </div>
    </div>
);

export const StageOverview: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageOverviewPlain);
