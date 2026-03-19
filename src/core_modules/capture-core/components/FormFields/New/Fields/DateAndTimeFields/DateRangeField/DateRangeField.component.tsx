import * as React from 'react';
import { withStyles, withTheme, WithStyles } from 'capture-core-utils/styles';
import { DateRangeField as UIDateRangeField } from 'capture-ui';
import { systemSettingsStore } from '../../../../../../metaDataMemoryStores';

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

const DateRangeFieldPlain = (props: Props & WithStyles<typeof getStyles>) => {
    const { value, onBlur, onChange, ...passOnProps } = props;
    return (
        <UIDateRangeField
            value={value || { from: null, to: null }}
            onBlur={onBlur}
            onChange={onChange || (() => { /* no-op */ })}
            {...passOnProps}
            locale={systemSettingsStore.get().uiLocale}
        />
    );
};

export const DateRangeField = withTheme()(withStyles(getStyles)(DateRangeFieldPlain));
