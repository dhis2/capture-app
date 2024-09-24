// @flow
import React, { type ComponentType } from 'react';
import { spacers, spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { NonBundledDhis2Icon } from '../../../../NonBundledDhis2Icon';
import type { Props } from './widgetStageHeader.types';

const styles = () => ({
    wrapper: {
        paddingLeft: spacersNum.dp12,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        minHeight: '24px',
    },
    icon: {
        paddingRight: spacersNum.dp4,
    },
    prefix: {
        marginInlineEnd: spacers.dp4,
    },
});

const WidgetStageHeaderPlain = ({
    stage,
    classes,
}: Props) => (
    <div className={classes.header}>
        <span className={classes.prefix}>New event in</span>
        {stage?.icon && (
            <div className={classes.icon}>
                <NonBundledDhis2Icon
                    name={stage?.icon?.name}
                    color={stage?.icon?.color}
                    width={24}
                    height={24}
                    cornerRadius={3}
                />
            </div>
        )}
        <span className={classes.stageName}>{stage?.name}</span>
    </div>
);

export const WidgetStageHeader: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(WidgetStageHeaderPlain);
