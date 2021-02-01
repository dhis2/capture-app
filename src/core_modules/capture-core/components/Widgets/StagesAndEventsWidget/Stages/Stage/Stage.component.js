// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacersNum } from '@dhis2/ui';
import { StageOverview } from './StageOverview';
import type { Props } from './stage.types';

const styles = {
    overview: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
    },
};


export const StagePlain = ({ stage: { name, icon }, classes }: Props) => (
    <div className={classes.overview}>
        <StageOverview
            title={name}
            icon={icon}
        />
    </div>
);

export const Stage: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StagePlain);
