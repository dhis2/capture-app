// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { TrueOnlyField as UITrueOnlyField } from 'capture-ui';

const getStyles = (theme: Theme) => ({
    iconSelected: {
        fill: theme.palette.secondary.main,
    },
    iconDeselected: {
        fill: theme.palette.grey[700],
    },
    iconDisabled: {
        fill: 'rgba(0,0,0,0.30)',
    },
    focusSelected: {
        backgroundColor: fade(theme.palette.secondary.main, 0.4),
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
