// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, Tooltip, spacers, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { NonBundledDhis2Icon } from '../../../NonBundledDhis2Icon';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp8,
        padding: spacers.dp16,
        paddingTop: 0,
    },
    button: {
        alignSelf: 'start',
    },
    cancelbutton: {
        alignSelf: 'start',
        marginTop: spacersNum.dp16,
    },
};

const ProgramStageSelectorComponentPlain = ({ programStages, onSelectProgramStage, onCancel, classes }) => (
    <div className={classes.container}>
        {programStages.map((programStage) => {
            const disableStage = !programStage.repeatable && programStage.eventCount > 0;
            return (
                <div
                    key={programStage.id}
                >
                    <Button
                        className={classes.button}
                        secondary
                        disabled={disableStage}
                        onClick={() => onSelectProgramStage(programStage.id)}
                        dataTest={'program-stage-selector-button'}
                        icon={
                            programStage.style?.icon && (
                                <div className={classes.icon}>
                                    <NonBundledDhis2Icon
                                        name={programStage.style?.icon}
                                        color={programStage.style?.color}
                                        width={24}
                                        height={24}
                                        cornerRadius={5}
                                    />
                                </div>
                            )
                        }
                    >
                        <Tooltip
                            content={i18n.t('You can’t add any more {{ programStageName }} events', {
                                programStageName: programStage.displayName,
                                interpolation: { escapeValue: false },
                            })}
                        >
                            {({ onMouseOver, onMouseOut, ref }) => (
                                <div
                                    ref={(divRef) => {
                                        if (divRef && disableStage) {
                                            divRef.onmouseover = onMouseOver;
                                            divRef.onmouseout = onMouseOut;
                                            ref.current = divRef;
                                        }
                                    }}
                                >
                                    {programStage.displayName}
                                </div>
                            )}
                        </Tooltip>
                    </Button>
                </div>
            );
        })}
        <Button
            className={classes.cancelbutton}
            secondary
            big
            onClick={onCancel}
        >
            {i18n.t('Cancel without saving')}
        </Button>
    </div>
);

export const ProgramStageSelectorComponent = withStyles(styles)(ProgramStageSelectorComponentPlain);
