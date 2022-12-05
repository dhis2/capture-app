import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, Tooltip } from '@dhis2/ui';
import { WithStyles, withStyles } from '@material-ui/core';
import type { QuickActionButtonTypes } from './QuickActionButton.types';

const styles = {
    button: {
        display: 'flex',
        gap: spacers.dp8,
        alignItems: 'center',
    },
};

interface Props extends QuickActionButtonTypes, WithStyles<typeof styles> {}

const QuickActionButtonPlain = ({
    icon,
    label,
    onClickAction,
    dataTest,
    disable,
    classes,
}: Props) => (
    <Tooltip content={i18n.t('No available program stages')}>
        {({
            onMouseOver,
            onMouseOut,
            ref,
        }: any) => (
            <div ref={(btnRef) => {
                if (btnRef && disable) {
                    btnRef.onmouseover = onMouseOver;
                    btnRef.onmouseout = onMouseOut;
                    ref.current = btnRef;
                }
            }}
            >
                <Button onClick={onClickAction} dataTest={dataTest} disabled={disable}>
                    <div className={classes.button}>
                        {icon}
                        {label}
                    </div>
                </Button>
            </div>
        )}
    </Tooltip>
);

export const QuickActionButton = withStyles(styles)(QuickActionButtonPlain);
