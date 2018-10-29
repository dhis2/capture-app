// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { CoordinateField as UICoordinateField } from 'capture-ui';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        position: 'relative',
        boxShadow: `0px 0px 0px 2px ${theme.palette.accent.dark}`,
        zIndex: 10,
        margin: '2px 0px 2px 0px',
    },
    inputWrapperUnfocused: {
        margin: '2px 0px 2px 0px',
    },
    innerInputError: {
        color: theme.palette.error.main,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputWarning: {
        color: theme.palette.warning.dark,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputInfo: {
        color: 'green',
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputValidating: {
        color: 'orange',
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    mapIcon: {
        fill: theme.palette.primary.dark,
    },
});

type Props = {
    value?: ?any,
    onBlur: (value: any) => void,
    classes: {
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
        innerInputError: string,
        innerInputWarning: string,
        innerInputInfo: string,
        innerInputValidating: string,
    },
}

const CoordinateField = (props: Props) => {
    const { ...passOnProps } = props;
    return (
        <UICoordinateField
            {...passOnProps}
        />
    );
};

export default withStyles(getStyles)(CoordinateField);
