// @flow
import React, { memo, type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { Widget } from '../../Widget';
import { DataEntry } from '../DataEntry';
import { FinishButtons } from '../FinishButtons';
import { SavingText } from '../SavingText';
import { WidgetRelatedStages } from '../../WidgetRelatedStages';
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
    orgUnit,
    id,
    ...passOnProps
}: Props) => (
    <Widget
        noncollapsible
        borderless
        header={
            <></>
        }
    >
        {ready && (
            <div className={classes.wrapper}>
                <DataEntry
                    {...passOnProps}
                    stage={stage}
                    formFoundation={formFoundation}
                    id={id}
                    orgUnit={orgUnit}
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
                <SavingText programName={programName} stageName={stage.name} orgUnitName={orgUnit.name} />
            </div>
        )}
    </Widget>
);

export const ValidatedComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(memo(ValidatedPlain));
// Adding memo because the lifecycle method in Validated.container grabs the entire state object.
