// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { Stage } from './Stage';
import type { Props } from './stages.types';

const styles = {};
export const StagesPlain = ({ stages, events, classes, onEventClick }: Props) => (
    <>
        {
            stages
                .map(stage => (
                    <Stage
                        events={events?.filter(event => event.programStage === stage.id)}
                        key={stage.id}
                        stage={stage}
                        className={classes.stage}
                        onEventClick={onEventClick}
                    />
                ))
        }
    </>
);

export const Stages: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StagesPlain);
