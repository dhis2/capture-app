// @flow
import React, { type Element } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers } from '@dhis2/ui';
import { Tooltip, withStyles } from '@material-ui/core';

const styles = {
    button: {
        display: 'flex',
        gap: spacers.dp8,
        alignItems: 'center',
    },
};

type Props = {|
    icon: Element<any>,
    label: string,
    onClickAction: () => void,
    dataTest?: string,
    disable?: ?boolean,
    ...CssClasses,
|}

const QuickActionButtonPlain = ({ icon, label, onClickAction, dataTest, disable, classes }: Props) => (
    <Button
        onClick={onClickAction}
        dataTest={dataTest}
        disabled={disable}
    >
        <Tooltip
            title={disable ? i18n.t('No available program stages') : ''}
        >
            <div className={classes.button}>
                {icon}
                {label}
            </div>
        </Tooltip>
    </Button>
);

export const QuickActionButton = withStyles(styles)(QuickActionButtonPlain);
