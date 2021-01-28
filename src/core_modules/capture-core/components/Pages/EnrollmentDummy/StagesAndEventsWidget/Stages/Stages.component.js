// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacersNum } from '@dhis2/ui';
import { Stage } from './Stage';
import type { Props } from './stages.types';

const styles = {
    stage: {
        marginBottom: spacersNum.dp16,
    },
};
export const StagesPlain = ({ stages, classes }: Props) => (
    <>
        {
            [...stages.values()]
                .map(stage => (
                    <div
                        key={stage.id}
                        className={classes.stage}
                    >
                        <Stage
                            stage={stage}
                        />
                    </div>
                ))
        }
    </>
);

export const Stages: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StagesPlain);
