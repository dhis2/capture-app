import React from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { colors } from '@dhis2/ui';
import { TrueOnlyField as UITrueOnlyField } from 'capture-ui';

const getStyles = (theme: any) => ({
    iconSelected: {
        fill: theme.palette.secondary.main,
    },
    iconDeselected: {
        fill: colors.grey700,
    },
    iconDisabled: {
        fill: 'rgba(0,0,0,0.30)',
    },
    focusSelected: {
        backgroundColor: 'rgba(0, 121, 107, 0.4)',
    },
});

type Props = {
    onBlur: (value: any, event: any) => void,
};

class TrueOnlyFieldPlain extends React.Component<Props & WithStyles<typeof getStyles>> {
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

export const TrueOnlyField = withStyles(getStyles)(TrueOnlyFieldPlain);
