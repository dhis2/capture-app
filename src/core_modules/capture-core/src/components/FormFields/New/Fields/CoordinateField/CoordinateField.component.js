// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import D2Coordinate from '../../../d2UiReactAdapters/CoordinateField/D2Coordinate.component';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.accent.dark}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
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
        <D2Coordinate
            {...passOnProps}
        />
    );
};

export default withStyles(getStyles)(CoordinateField);
