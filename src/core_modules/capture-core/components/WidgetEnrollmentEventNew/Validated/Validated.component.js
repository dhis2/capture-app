// @flow
import React, { memo, type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { Widget } from '../../Widget';
import { DataEntry } from '../DataEntry';
import { FinishButtons } from '../FinishButtons';
import { WidgetRelatedStages } from '../../WidgetRelatedStages';
import { usePlacementDomNode } from '../../../utils/portal/usePlacementDomNode';
import type { Props } from './validated.types';

const styles = () => ({
    wrapper: {
        paddingLeft: spacersNum.dp16,
    },
});

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
}: Props) => {
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
                        <WidgetRelatedStages
                            ref={relatedStageRef}
                            enrollmentId={enrollmentId}
                            programId={programId}
                            programStageId={stage?.id}
                            currentStageLabel={stage.name}
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

export const ValidatedComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(memo(ValidatedPlain));
// Adding memo because the lifecycle method in Validated.container grabs the entire state object.
