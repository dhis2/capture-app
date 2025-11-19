import React, { type ComponentType, useMemo } from 'react';
import { compose } from 'redux';
import { Stage } from './Stage';
import type { PlainProps, InputProps } from './stages.types';
import { withLoadingIndicator } from '../../../HOC';

export const StagesPlain = ({ stages, events, ...passOnProps }: PlainProps) => {
    const eventsByStage = useMemo(
        () => stages.reduce(
            (acc, stage) => {
                acc[stage.id] = acc[stage.id] || [];
                return acc;
            },
            events.reduce(
                (acc, event) => {
                    const stageId = event.programStage;
                    if (acc[stageId]) {
                        acc[stageId].push(event);
                    } else {
                        acc[stageId] = [event];
                    }
                    return acc;
                },
                {},
            ),
        ),
        [stages, events],
    );

    return (<>
        {
            stages
                .filter(stage => stage.dataAccess.read)
                .map(stage => (
                    <Stage
                        events={eventsByStage[stage.id]}
                        key={stage.id}
                        stage={stage}
                        {...passOnProps}
                    />
                ))
        }
    </>);
};

export const Stages = compose(withLoadingIndicator())(StagesPlain) as ComponentType<InputProps>;
