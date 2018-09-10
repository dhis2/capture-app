// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { D2BooleanField } from '../../../../d2UiReactAdapters';

const getStyles = (theme: Theme) => ({
    iconSelected: {
        fill: theme.palette.secondary.main,
    },
    iconDeselected: {
        fill: theme.palette.grey[700],
    },
});

type Props = {
    onBlur: any,
};

class BooleanField extends React.Component<Props> {
    render() {
        const { onBlur, ...passOnProps } = this.props;
        return (
            <D2BooleanField
                onSelect={onBlur}
                {...passOnProps}
            />
        );
    }
}

export default withStyles(getStyles)(BooleanField);
