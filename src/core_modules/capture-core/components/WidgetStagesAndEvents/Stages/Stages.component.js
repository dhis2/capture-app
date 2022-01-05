// @flow
import React, { type ComponentType } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core';
import { Stage } from './Stage';
import type { PlainProps, InputProps } from './stages.types';
import { withLoadingIndicator } from '../../../HOC';

const styles = {};
export const StagesPlain = ({ stages, events, classes, ...passOnProps }: PlainProps) => (
    <>
        {
            stages
                .map(stage => (
                    <Stage
                        // $FlowFixMe
                        events={events?.filter(event => event.programStage === stage.id)}
                        key={stage.id}
                        stage={stage}
                        className={classes.stage}
                        {...passOnProps}
                    />
                ))
        }
    </>
);

export const Stages: ComponentType<InputProps> = compose(withLoadingIndicator(), withStyles(styles))(StagesPlain);
