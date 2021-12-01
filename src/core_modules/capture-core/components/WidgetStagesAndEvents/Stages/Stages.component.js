// @flow
import { compose } from 'redux';
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { withLoadingIndicator } from '../../../HOC';
import type { Props } from './stages.types';
import { Stage } from './Stage';

const styles = {};
export const StagesPlain = ({ stages, events, classes, ...passOnProps }: Props) => (
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

export const Stages: ComponentType<$Diff<Props, CssClasses>> = compose(withLoadingIndicator(), withStyles(styles))(StagesPlain);
