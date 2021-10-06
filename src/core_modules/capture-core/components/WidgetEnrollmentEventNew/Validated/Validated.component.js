// @flow
import React, { memo, type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { Widget } from '../../Widget';
import { DataEntry } from '../DataEntry';
import { FinishButtons } from '../FinishButtons';
import { BottomText, textMode } from '../BottomText';
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
    formFoundation,
    classes,
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
                <FinishButtons
                    onSave={onSave}
                    onCancel={onCancel}
                    id={id}
                />
                <BottomText
                    programName={programName}
                    stageName={stage.name}
                    orgUnitName={orgUnit.name}
                    mode={textMode.SAVE}
                />
            </div>
        )}
    </Widget>
);

export const ValidatedComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(memo(ValidatedPlain));
// Adding memo because the lifecycle method in Validated.container grabs the entire state object.
