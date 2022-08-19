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
        gap: '10px',
        padding: spacers.dp16,
        paddingTop: 0,
    },
    button: {
        alignSelf: 'start',
    },
    buttonText: {
        paddingLeft: spacersNum.dp8,
    },
    buttonContentContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    cancelbutton: {
        alignSelf: 'start',
        marginTop: spacersNum.dp24,
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
                        big
                        secondary
                        disabled={disableStage}
                        onClick={() => onSelectProgramStage(programStage.id)}
                        dataTest={'program-stage-selector-button'}
                    >
                        <Tooltip
                            content={i18n.t('You can’t add any more events in this program')}
                        >
                            {({ onMouseOver, onMouseOut, ref }) => (
                                <div
                                    className={classes.buttonContentContainer}
                                    ref={(divRef) => {
                                        if (divRef && disableStage) {
                                            divRef.onmouseover = onMouseOver;
                                            divRef.onmouseout = onMouseOut;
                                            ref.current = divRef;
                                        }
                                    }}
                                >
                                    <NonBundledDhis2Icon
                                        width={22}
                                        height={22}
                                        name={programStage.style?.icon || 'clinical_fe_outline'}
                                        color={programStage.style?.color || '#e0e0e0'}
                                        alternativeText={programStage.displayName}
                                        cornerRadius={2}
                                    />
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
