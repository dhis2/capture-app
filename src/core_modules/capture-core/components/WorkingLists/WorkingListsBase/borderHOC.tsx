import * as React from 'react';
import { withStyles } from 'capture-core-utils/styles';
import type { WithStyles } from 'capture-core-utils/styles';


const getBorder = (theme: any) => {
    const color = theme.palette.dividerLighter;
    return `${theme.typography.pxToRem(1)} solid ${color}`;
};

const getStyles = (theme: any) => ({
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
