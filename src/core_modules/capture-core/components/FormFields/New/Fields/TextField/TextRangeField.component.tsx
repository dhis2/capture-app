import * as React from 'react';
import { withStyles, withTheme, WithStyles } from '@material-ui/core/styles';
import { TextRangeField as UITextRangeField } from 'capture-ui';

const getStyles = (theme: any) => ({
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
    value?: any | null,
    onBlur: (value: any) => void,
    onChange?: (value: any) => void,
}

const TextRangeFieldPlain = (props: Props & WithStyles<typeof getStyles>) => {
    const { onChange, ...passOnProps } = props;
    return (
        <UITextRangeField
            onChange={onChange || (() => undefined)}
            {...passOnProps}
        />
    );
};

export const TextRangeField = withTheme()(withStyles(getStyles)(TextRangeFieldPlain));
