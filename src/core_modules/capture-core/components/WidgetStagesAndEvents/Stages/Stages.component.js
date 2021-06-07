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
export const StagesPlain = ({ stages, events, programMetadata, classes }: Props) => (
    <>
        {
            [...stages.values()]
                .map(stage => (
                    <Stage
                        events={events?.filter(event => event.programStage === stage.id)}
                        programStage={programMetadata?.
                            programStages?.
                            filter(programStage => programStage.id === stage.id)?.[0]
                        }
                        key={stage.id}
                        stage={stage}
                        className={classes.stage}
                    />
                ))
        }
    </>
);

export const Stages: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StagesPlain);
