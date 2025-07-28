
import { colors } from '@dhis2/ui';
import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';

type Props = {
    value?: any | null,
    valueConverter?: (value: any) => any | null,
}

const getStyles = () => ({
    container: {
        width: '100%',
        fontWeight: 500,
        fontSize: 14,
        color: colors.grey900,
    },
});

class ViewModeFieldPlain extends React.Component<Props & WithStyles<typeof getStyles>> {
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
