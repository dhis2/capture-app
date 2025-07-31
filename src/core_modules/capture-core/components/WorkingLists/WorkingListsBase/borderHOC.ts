import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import type { WithStyles } from '@material-ui/core';
import type { Theme } from '@material-ui/core/styles';

const getBorder = (theme: Theme) => {
    const color = theme.palette.grey[300];
    return `${theme.typography.pxToRem(1)} solid ${color}`;
};

const getStyles = (theme: Theme) => ({
    container: {
        border: getBorder(theme),
    },
});

type Props = {
};

export const withBorder = () => (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)(class BorderHOC extends React.Component<Props & WithStyles<typeof getStyles>> {
        render() {
            const { classes, ...passOnProps } = this.props;
            return React.createElement(
                'div',
                {
                    className: classes.container,
                    'data-test': 'workinglists-border',
                },
                React.createElement(InnerComponent, passOnProps),
            );
        }
    });
