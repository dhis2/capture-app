// @flow
import React, { useCallback, useState } from 'react';
import type { ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetError.types';
import { useFilteredWidgetData } from './hooks';

const styles = {
    errorWidgetWrapper: {
        backgroundColor: '#ffe6e8',
    },
    errorUL: {
        '&::marker': {
            content: '"!"',
            color: '#d52525',
        },
    },
};

const WidgetErrorPlain = ({ classes }: Props) => {
    const [openStatus, setOpenStatus] = useState(true);

    const rules = [
        {
            type: 'SHOWWARNING',
            id: 'general',
            warning: {
                id: '"v434s5YPDcP"',
                message: 'It is suggested that an explanation is provided when the Apgar score is below 4 ',
            },
        },
        {
            type: 'SHOWERROR',
            id: 'general',
            error: {
                id: 'os4RtefrWcp',
                message: 'Testerror',
            },
        },
        {
            type: 'SHOWERROR',
            id: 'general',
            error: {
                id: 'os4EteCrWcp',
                message: 'Testerror 2',
            },
        },
        {
            type: 'DISPLAYKEYVALUEPAIRS',
            id: 'indicators',
            displayKeyValuePair: {
                id: 'fM7RZGVndZE',
                key: 'Measles + Yellow fever doses',
                value: '',
            },
        },
    ];

    const { showError } = useFilteredWidgetData(rules);

    if (!showError || showError.length === 0) {
        return null;
    }

    return (
        <div
            className={classes}
            data-test={'error-widget'}
        >
            <Widget
                header={i18n.t('Error')}
                open={openStatus}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
            >
                <div className={classes.errorWidgetWrapper}>
                    <ul className={classes.errorUL}>
                        {showError && showError.map(errorRule => (
                            <li key={errorRule.error.id}>
                                {errorRule.error.message}
                            </li>
                        ))}
                    </ul>
                </div>
            </Widget>
        </div>
    );
};

export const WidgetError: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetErrorPlain);

