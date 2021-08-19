// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const getBorder = (theme: Theme) => {
    const color = theme.palette.dividerLighter;
    return `${theme.typography.pxToRem(1)} solid ${color}`;
};

const getStyles = (theme: Theme) => ({
    container: {
        border: getBorder(theme),
    },
});

type Props = {
    classes: {
        container: string,
    },
};

export const withBorder = () => (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)(class BorderHOC extends React.Component<Props> {
        render() {
            const { classes, ...passOnProps } = this.props;
            return (
                <div
                    className={classes.container}
                    data-test="workinglists-border"
                >
                    <InnerComponent
                        {...passOnProps}
                    />
                </div>
            );
        }
    });
