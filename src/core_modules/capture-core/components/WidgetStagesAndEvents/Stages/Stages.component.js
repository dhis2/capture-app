// @flow
import React, { type ComponentType } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core';
import { Stage } from './Stage';
import type { Props } from './stages.types';
import { withLoadingIndicator } from '../../../HOC';

const styles = {};
export const StagesPlain = ({ stages, events, ready, classes, ...passOnProps }: Props) => (
    ready ? <>
        {
            stages
                .map(stage => (
                    <Stage
                        // $FlowFixMe
                        events={events.filter(event => event.programStage === stage.id)}
                        key={stage.id}
                        stage={stage}
                        className={classes.stage}
                        {...passOnProps}
                    />
                ))
        }
    </> : null);

export const Stages: ComponentType<$Diff<Props, CssClasses>> = compose(withLoadingIndicator(), withStyles(styles))(StagesPlain);
