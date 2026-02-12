import React from 'react';
import { spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';
import type { Props } from './widgetStageHeader.types';

const styles = () => ({
    wrapper: {
        paddingInlineStart: spacersNum.dp16,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingInlineEnd: spacersNum.dp8,
    },
});

type WidgetStageHeaderPlainProps = Props & WithStyles<typeof styles>;

const WidgetStageHeaderPlain = ({
    stage,
    classes,
}: WidgetStageHeaderPlainProps) => (
    <div className={classes.header}>
        {stage?.icon && (
            <div className={classes.icon}>
                <NonBundledDhis2Icon
                    name={stage?.icon?.name}
                    color={stage?.icon?.color}
                    width={30}
                    height={30}
                    cornerRadius={2}
                />
            </div>
        )}
        <span>{stage?.name}</span>
    </div>
);

export const WidgetStageHeader = withStyles(styles)(WidgetStageHeaderPlain);
