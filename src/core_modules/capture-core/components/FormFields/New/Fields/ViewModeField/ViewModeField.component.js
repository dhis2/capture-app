
// @flow
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';

type Props = {
    value?: ?any,
    valueConverter?: ?(value: any) => any,
    classes: {
        container: string,
    },
}

const getStyles = () => ({
    container: {
        width: '100%',
        fontWeight: 500,
    },
});

class ViewModeFieldPlain extends React.Component<Props> {
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

export const ViewModeField = withStyles(getStyles)(ViewModeFieldPlain);
