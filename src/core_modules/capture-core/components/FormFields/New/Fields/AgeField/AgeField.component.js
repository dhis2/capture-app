// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AgeField as UIAgeField } from 'capture-ui';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';

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

const AgeFieldPlain = (props: Props) => {
    const {
        ...passOnProps
    } = props;

    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <UIAgeField
            datePlaceholder={systemSettingsStore.get().dateFormat.toLowerCase()}
            locale={systemSettingsStore.get().uiLocale}
            {...passOnProps}
        />
    );
};

export const AgeField = withTheme()(withStyles(getStyles)(AgeFieldPlain));
