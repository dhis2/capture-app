import React, { memo } from 'react';
import { spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Widget } from '../../Widget';
import { DataEntry } from '../DataEntry';
import { FinishButtons } from '../FinishButtons';
import { RelatedStagesActions } from '../../WidgetRelatedStages';
import { usePlacementDomNode } from '../../../utils/portal/usePlacementDomNode';
import type { Props } from './validated.types';

const styles: Readonly<any> = {
    wrapper: {
        paddingInlineStart: spacersNum.dp16,
    },
};

const ValidatedPlain = ({
    ready,
    stage,
    programName,
    programId,
    enrollmentId,
    eventSaveInProgress,
    formFoundation,
    classes,
    relatedStageRef,
    onSave,
    onCancel,
    id,
    ...passOnProps
}: Props & WithStyles<typeof styles>) => {
    const { domRef: savingTextRef, domNode: savingTextDomNode } = usePlacementDomNode();

    return (
        <Widget
            noncollapsible
            borderless
            header={
                <></>
            }
        >
            <div className={classes.wrapper}>
                {ready && (
                    <>
                        <DataEntry
                            {...passOnProps}
                            stage={stage}
                            formFoundation={formFoundation}
                            id={id}
                            placementDomNodeForSavingText={savingTextDomNode}
                            programName={programName}
                        />
                        <RelatedStagesActions
                            ref={relatedStageRef}
                            enrollmentId={enrollmentId}
                            programId={programId}
                            programStageId={stage?.id}
                        />
                        <FinishButtons
                            onSave={onSave}
                            onCancel={onCancel}
                            isLoading={eventSaveInProgress}
                            cancelButtonIsDisabled={eventSaveInProgress}
                            id={id}
                        />
                    </>
                )}
                <div ref={savingTextRef} />
            </div>
        </Widget>
    );
};

export const ValidatedComponent = withStyles(styles)(memo(ValidatedPlain));
// Adding memo because the lifecycle method in Validated.container grabs the entire state object.
