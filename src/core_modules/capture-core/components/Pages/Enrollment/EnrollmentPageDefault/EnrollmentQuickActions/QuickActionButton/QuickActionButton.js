// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, Tooltip } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { QuickActionButtonTypes } from './QuickActionButton.types';

const styles = {
    button: {
        display: 'flex',
        gap: spacers.dp8,
        alignItems: 'center',
    },
};

const QuickActionButtonPlain = ({ icon, label, onClickAction, dataTest, disable, classes }: QuickActionButtonTypes) => (
    <Tooltip
        content={i18n.t('No available program stages')}
    >
        { ({ onMouseOver, onMouseOut, ref }) => (
            <div ref={(btnRef) => {
                if (btnRef && disable) {
                    btnRef.onmouseover = onMouseOver;
                    btnRef.onmouseout = onMouseOut;
                    ref.current = btnRef;
                } else {
                    if (btnRef) {
                        btnRef.onmouseover = null;
                        btnRef.onmouseout = null;
                    }
                    ref.current = null;
                }
            }}
            >
                <Button
                    onClick={onClickAction}
                    dataTest={dataTest}
                    disabled={disable}
                >

                    <div className={classes.button}>
                        {icon}
                        {label}
                    </div>
                </Button>
            </div>)}
    </Tooltip>);

export const QuickActionButton = withStyles(styles)(QuickActionButtonPlain);
