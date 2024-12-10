// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { DateField as UIDateField } from 'capture-ui';
import { withCalendarProps } from '../../../HOC/withCalendarProps';
import { systemSettingsStore } from '../../../../../../metaDataMemoryStores';

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
}

class DateFieldPlain extends React.Component<Props> {
    render() {
        const { ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <UIDateField
                placeholder={systemSettingsStore.get().dateFormat.toLowerCase()}
                {...passOnProps}
            />
        );
    }
}

export const DateField = withTheme()(withCalendarProps()(withStyles(getStyles)(DateFieldPlain)));
