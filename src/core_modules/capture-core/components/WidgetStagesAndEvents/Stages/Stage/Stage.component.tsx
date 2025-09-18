import React, { useState, useCallback } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import { spacersNum } from '@dhis2/ui';
import { StageOverview } from './StageOverview';
import type { Props } from './stage.types';
import { Widget } from '../../../Widget';
import { StageDetail } from './StageDetail/StageDetail.component';
import { StageCreateNewButton } from './StageCreateNewButton';

const styles = {
    overview: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
        marginBottom: spacersNum.dp24,
    },
    buttonContainer: {
        margin: `0 ${spacersNum.dp12}px ${spacersNum.dp8}px ${spacersNum.dp12}px`,
    },
    buttonRow: {
        display: 'flex',
        alignItems: 'center',
    },
};

const rulesEffectHideProgramStage = (ruleEffects: Array<{id: string, type: string}> | undefined, stageId: string) => (
    Boolean(ruleEffects?.find(ruleEffect => ruleEffect.type === 'HIDEPROGRAMSTAGE' && ruleEffect.id === stageId))
);

export const StagePlain = ({ 
    stage, events, classes, onCreateNew, ruleEffects, ...passOnProps 
}: Props & WithStyles<typeof styles>) => {
    const [open, setOpenStatus] = useState(true);
    const { id, name, icon, description, dataElements, hideDueDate, repeatable, enableUserAssignment } = stage;
    const preventAddingNewEvents = rulesEffectHideProgramStage(ruleEffects, id);
    const hideProgramStage = preventAddingNewEvents && events.length === 0;

    const handleOpen = useCallback(() => setOpenStatus(true), [setOpenStatus]);
    const handleClose = useCallback(() => setOpenStatus(false), [setOpenStatus]);

    if (hideProgramStage) return null;

    return (
        <div
            data-test="stage-content"
            className={classes.overview}
        >
            <Widget
                header={<StageOverview
                    title={name}
                    icon={icon}
                    description={description}
                    events={events}
                />}
                onOpen={handleOpen}
                onClose={handleClose}
                open={open}
            >
                {events.length > 0 ? <StageDetail
                    stageId={id}
                    eventName={name}
                    events={events}
                    dataElements={dataElements}
                    hideDueDate={hideDueDate}
                    repeatable={repeatable}
                    enableUserAssignment={enableUserAssignment}
                    onCreateNew={onCreateNew}
                    hiddenProgramStage={preventAddingNewEvents}
                    {...passOnProps}
                /> : (
                    <div className={classes.buttonContainer}>
                        <StageCreateNewButton
                            onCreateNew={() => onCreateNew(id)}
                            stageWriteAccess={stage.dataAccess.write}
                            eventCount={events.length}
                            repeatable={repeatable}
                            preventAddingEventActionInEffect={preventAddingNewEvents}
                            eventName={name}
                        />
                    </div>
                )}
            </Widget>
        </div>
    );
};

export const Stage = withStyles(styles)(StagePlain);
