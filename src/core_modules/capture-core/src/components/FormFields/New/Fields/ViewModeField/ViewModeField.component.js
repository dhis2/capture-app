
// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core';

type Props = {
    value?: ?any,
    valueConverter?: ?(value: any) => any,
}

const getStyles = (theme: Theme) => ({
    container: {
        paddingLeft: '12px',
        width: '100%',
    },
});

class ViewModeField extends React.Component<Props> {
    render() {
        const { value, valueConverter, classes } = this.props;
        const displayValue = valueConverter ? valueConverter(value) : value;

        return (
            <div className={classes.container}>
                {displayValue}
            </div>
        );
    }
}

export default withStyles(getStyles)(ViewModeField);
