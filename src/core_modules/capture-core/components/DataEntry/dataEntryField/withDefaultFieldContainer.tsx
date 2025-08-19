import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

type Props = WithStyles<typeof styles>;

const styles = (theme: any) => ({
    container: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2,
    },
});

const getFieldContainerBuilder = (InnerComponent: React.ComponentType<any>, customStyles?: Record<string, any>) =>
    class FieldContainerBuilder extends React.Component<Props> {
        render() {
            const { classes, ...passOnProps } = this.props;

            return (
                <div
                    className={classes.container}
                    style={customStyles}
                >
                    <InnerComponent
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export const withDefaultFieldContainer = (customStyles?: Record<string, any>) =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(getFieldContainerBuilder(InnerComponent, customStyles));
