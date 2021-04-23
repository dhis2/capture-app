// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors, spacersNum } from '@dhis2/ui';
import { NonBundledDhis2Icon } from '../../../../../NonBundledDhis2Icon';
import type { Props } from './stageOverview.types';

const styles = {
    container: {
        display: 'flex',
        padding: spacersNum.dp8,
        backgroundColor: colors.grey200,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    title: {
        fontSize: 18,
        lineHeight: 1.556,
        fontWeight: 500,
        color: colors.grey900,
    },
};
export const StageOverviewPlain = ({ title, icon, classes }: Props) => (
    <div className={classes.container}>
        {
            icon && (
                <div className={classes.icon}>
                    <NonBundledDhis2Icon
                        name={icon.name}
                        color={icon.color}
                        width={30}
                        height={30}
                        cornerRadius={2}
                    />
                </div>
            )
        }
        <div className={classes.title}>
            {title}
        </div>
    </div>
);

export const StageOverview: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageOverviewPlain);
