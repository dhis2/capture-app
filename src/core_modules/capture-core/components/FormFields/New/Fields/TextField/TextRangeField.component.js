// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { TextRangeField as UITextRangeField } from 'capture-ui';

const getStyles = (theme: Theme) => ({
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

const TextRangeFieldPlain = (props: Props) => {
    const { ...passOnProps } = props;
    return (
        <UITextRangeField
            {...passOnProps}
        />
    );
};

export const TextRangeField = withTheme()(withStyles(getStyles)(TextRangeFieldPlain));
