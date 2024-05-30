// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Button, spacersNum } from '@dhis2/ui';
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

const FinishButtonsPlain = ({
    onSave,
    cancelButton,
    isLoading,
    classes,
}: Props) => (
    <div className={classes.container}>
        <div className={classes.button}>
            <Button
                onClick={() => onSave(addEventSaveTypes.COMPLETE)}
                primary
                loading={isLoading}
            >
                {i18n.t('Complete')}
            </Button>
        </div>
        <div className={classes.button}>
            <Button
                onClick={() => onSave(addEventSaveTypes.SAVE_WITHOUT_COMPLETING)}
                disabled={isLoading}
            >
                {i18n.t('Save without completing')}
            </Button>
        </div>
        {cancelButton}
    </div>
);

export const FinishButtons: ComponentType<InputProps> = withCancelButton()(withStyles(styles)(FinishButtonsPlain));
