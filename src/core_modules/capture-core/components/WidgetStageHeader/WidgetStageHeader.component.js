// @flow
import React, { useMemo, type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';
import { getProgramAndStageForProgram } from '../../metaData';
import type { Props } from './widgetStageHeader.types';

const styles = () => ({
    wrapper: {
        paddingLeft: spacersNum.dp16,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
});

const WidgetStageHeaderPlain = ({
    stageId,
    programId,
    classes,
}: Props) => {
    const { stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);

    return (
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
};

export const WidgetStageHeader: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(WidgetStageHeaderPlain);
// Adding memo because the lifecycle method in Validated.container grabs the entire state object.
