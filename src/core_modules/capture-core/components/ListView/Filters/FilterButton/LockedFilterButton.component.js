// @flow
import React, { useCallback, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, Button } from '@dhis2/ui';


const getStyles = () => ({
    button: {
        cursor: 'not-allowed !important',
    },
});

type Props = {
    classes: {
        button: string,
    },
    title: string,
    buttonText?: string,
};

const MAX_LENGTH_OF_VALUE = 10;

const LockedFilterButtonPlain = ({ classes, title, buttonText = '' }: Props) => {
    const getCappedValue = useCallback((value: string) => {
        const cappedValue = value.substring(0, MAX_LENGTH_OF_VALUE - 3).trimRight();
        return `${cappedValue}...`;
    }, []);

    const viewValueForFiter = useMemo(() => {
        const calculatedValue = buttonText.length > MAX_LENGTH_OF_VALUE ? getCappedValue(buttonText) : buttonText;
        return `: ${calculatedValue}`;
    }, [buttonText, getCappedValue]);

    return (
        <Tooltip
            content={`${i18n.t('Locked to:')} ${buttonText}`}
            placement={'bottom'}
            openDelay={300}
        >
            <Button
                className={classes.button}
                disabled
            >
                {title}
                {viewValueForFiter}
            </Button>
        </Tooltip>
    );
};

export const LockedFilterButton = withStyles(getStyles)(LockedFilterButtonPlain);
