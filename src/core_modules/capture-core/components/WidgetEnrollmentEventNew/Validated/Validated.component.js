// @flow
import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import { Widget } from '../../Widget';
import { DataEntry } from '../DataEntry';
import { FinishButtons } from '../FinishButtons';
import { SavingText } from '../SavingText';
import type { Props } from './validated.types';

const styles = () => ({
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
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
}: Props) => {
    const { icon, name } = stage;

    return (
        <Widget
            noncollapsible
            header={
                <div className={classes.header}>
                    {icon && (
                        <div className={classes.icon}>
                            <NonBundledDhis2Icon
                                name={icon?.name}
                                color={icon?.color}
                                width={30}
                                height={30}
                                cornerRadius={2}
                            />
                        </div>
                    )}
                    <span>{name}</span>
                </div>
            }
        >
            {ready && (
                <>
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
                    <SavingText
                        programName={programName}
                        stageName={stage.name}
                        orgUnitName={orgUnit.name}
                    />
                </>
            )}
        </Widget>
    );
};

export const ValidatedComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(ValidatedPlain);
