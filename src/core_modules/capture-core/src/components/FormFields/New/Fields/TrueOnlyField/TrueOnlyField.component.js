// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TrueOnlyField as UITrueOnlyField } from '../../../../d2UiReactAdapters';

const getStyles = (theme: Theme) => ({
    iconSelected: {
        fill: theme.palette.secondary.main,
    },
    iconDeselected: {
        fill: theme.palette.grey[700],
    },
    focus: {
        border: `2px solid ${theme.palette.accent.dark}`,
        borderRadius: 2,
        padding: 2,
    },
    unFocus: {
        padding: 4,
    },
});

type Props = {
    onBlur: (value: any, event: any) => void,
};

class TrueOnlyField extends React.Component<Props> {
    render() {
        const { onBlur, ...passOnProps } = this.props;
        return (
            <UITrueOnlyField
                onSelect={onBlur}
                {...passOnProps}
            />
        );
    }
}

export default withStyles(getStyles)(TrueOnlyField);
