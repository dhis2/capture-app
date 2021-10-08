// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, spacersNum } from '@dhis2/ui';
import { withStyles, Tooltip } from '@material-ui/core';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';

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

const WidgetProgramStageSelectorComponentPlain = ({ programStages, onProgramStageUpdate, onCancel, classes }) => (
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
                        onClick={() => onProgramStageUpdate(programStage.id)}
                    >
                        <Tooltip
                            title={disableStage ? i18n.t('Stage is non-repeatable') : ''}
                        >
                            <div
                                className={classes.buttonContentContainer}
                            >
                                <NonBundledDhis2Icon
                                    width={22}
                                    height={22}
                                    name={programStage.icon?.name || 'clinical_fe_outline'}
                                    color={programStage.icon?.color || '#e0e0e0'}
                                    alternativeText={programStage.name}
                                    cornerRadius={2}
                                />
                                {programStage.name}
                            </div>
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

export const WidgetProgramStageSelectorComponent = withStyles(styles)(WidgetProgramStageSelectorComponentPlain);
