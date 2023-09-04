// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Button, spacersNum } from '@dhis2/ui';
import { ConditionalTooltip } from 'capture-core/components/ConditionalTooltip';
import { withCancelButton } from '../../DataEntry/withCancelButton';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import type { InputProps, Props } from './finishButtons.types';

const styles = {
    container: {
        display: 'flex',
        marginTop: spacersNum.dp4,
    },
    button: {
        paddingRight: spacersNum.dp8,
    },
};

const FinishButtonsPlain = ({ onSave, cancelButton, hiddenProgramStage, stageName, classes }: Props) => (
    <div className={classes.container}>
        <div className={classes.button}>
            <ConditionalTooltip
                content={i18n.t("You can't add any more {{ programStageName }} events", {
                    programStageName: stageName,
                    interpolation: { escapeValue: false },
                })}
                enabled={hiddenProgramStage}
            >
                <Button
                    disabled={hiddenProgramStage}
                    onClick={() => onSave(addEventSaveTypes.COMPLETE)}
                    primary
                >
                    {i18n.t('Complete')}
                </Button>
            </ConditionalTooltip>
        </div>
        <div className={classes.button}>
            <ConditionalTooltip
                content={i18n.t("You can't add any more {{ programStageName }} events", {
                    programStageName: stageName,
                    interpolation: { escapeValue: false },
                })}
                enabled={hiddenProgramStage}
            >
                <Button
                    disabled={hiddenProgramStage}
                    onClick={() => onSave(addEventSaveTypes.SAVE_WITHOUT_COMPLETING)}
                >
                    {i18n.t('Save without completing')}
                </Button>
            </ConditionalTooltip>
        </div>
        {cancelButton}
    </div>
);

export const FinishButtons: ComponentType<InputProps> = withCancelButton()(withStyles(styles)(FinishButtonsPlain));
